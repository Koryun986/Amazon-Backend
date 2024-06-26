import Stripe from "stripe";
import {STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET} from "../config/envirenmentVariables";
import {UserDto} from "../dtos/user-dto";
import {User} from "../database/models/user";
import {ApiError} from "../exceptions/api-error";
import {StripeCustomer} from "../database/models/stripe-customer";

class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY);
  }

  async createProduct(id: number, price: number, isActive: boolean) {
    return await this.stripe.products.create({
      name: id,
      default_price_data: {
        currency: "usd",
        unit_amount: price * 100,
      },
      active: isActive,
      metadata: {
        id
      }
    });
  }

  async updateProduct(id: number, price: number, isActive: boolean) {
    const product = await this.queryProductById(id);
    const priceObj = await this.createPrice(product.id, price);
    return await this.stripe.products.update(
      product.id,
      {
        active: isActive,
        default_price: priceObj.id
      }
    )
  }

  async changeProductStatus(id: number, isActive: boolean) {
    const product = await this.queryProductById(id);
    return await this.stripe.products.update(
      product.id,
      {
        active: isActive,
      }
    )
  }

  async deleteProduct(id: number) {
    const product = await this.queryProductById(id);
    if (product) {
      try {
          await this.stripe.products.del(product?.id);
      } catch (e) {
        await this.stripe.products.update(
          product.id,
          {
            active: false,
          }
        )
      }
    }
  }

  async createCustomer(userDto: UserDto) {
    return await this.stripe.customers.create({
      name: `${userDto.first_name} ${userDto.last_name}`,
      email: userDto.email,
    });
  }

  async buyProduct(amount: number, productsInfo: {id: number, count: number}[], customerId: string) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customerId,
      metadata: {
        products: JSON.stringify(productsInfo),
      }
    });
  }

  async createPrice(id: number | string, price:number) {
    return await this.stripe.prices.create({
      currency: "usd",
      unit_amount: price * 100,
      product: id
    });
  }

  async getCustomerPayedProducts(userDto: UserDto) {
    const userEntity = await User.findOne({where: {email: userDto.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const customerEntity = await StripeCustomer.findOne({where: {user_id: userEntity.id}});
    const payments = await this.getUserPayments(customerEntity.stripe_customer_id);
    return payments.reduce((acc, cur) => {
      if (!cur.metadata?.products) {
        return acc;
      }
      const products = JSON.parse(cur.metadata.products).map(product => ({
        ...product,
        status: cur.status,
        date: cur.created,
        payment_id: cur.id,
      }));
      return [...acc, ...products];
    }, [])
  }

  async getUserPayments(customerId: string) {
    return (await this.stripe.paymentIntents.search({
      query: `customer:'${customerId}'`,
    })).data;
  }

  async getCustomersOrderedProducts(customerId: string) {
    const payments = await this.getUserCompletedPayments(customerId);
    return payments.reduce((acc, cur) => {
      if (!cur.metadata?.products) {
        return acc;
      }
      const products = JSON.parse(cur.metadata.products).map(product => ({
        ...product,
        status: cur.status,
        date: cur.created,
        payment_id: cur.id,
      }));
      return [...acc, ...products];
    }, [])
  }

  async getUserCompletedPayments(customerId: string) {
    return (await this.stripe.paymentIntents.search({
      query: `customer:'${customerId}' AND status:'succeeded'`,
    })).data;
  }

  async removeProductFromPayment(paymentId: string, productId: number) {
    const payment = await this.stripe.paymentIntents.retrieve(paymentId);
    const products = payment.metadata?.products && JSON.parse(payment.metadata.products);
    if (!products) {
      return
    }
    const newProducts = products.filter(product => product.id !== productId);
    if (newProducts.length) {
      await this.stripe.paymentIntents.update(
        paymentId,
        {
          metadata: {
            products: JSON.stringify(newProducts),
          },
        }
      );
      return;
    }
    await this.stripe.paymentIntents.update(
      paymentId,
      {
        metadata: {},
      }
    );
    await this.stripe.paymentIntents.retrieve(paymentId);
  }

  constructEvent(data: any, sig: string | string[]) {
    return this.stripe.webhooks.constructEvent(data, sig, STRIPE_WEBHOOK_ENDPOINT_SECRET);
  }

  async getPaymentById(id: string) {
    return await this.stripe.paymentIntents.retrieve(id);
  }

  async createProductSubscription(productId: number, customerId: string, productPrice: number) {
    const isSubscriptionExist = await this.checkIsProductsSubscriptionExist(customerId, productId);
    if (isSubscriptionExist) {
      throw new Error("You already have subscription on this product");
    }
    const product = await this.queryProductById(productId);
    const price = await this.getProductRecurringPrice(product.id, productPrice);
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: price.id,
      }],
      metadata: {
        product: productId,
        customer: customerId,
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async getCustomersSubscriptions(customerId: string) {
    return (await this.stripe.subscriptions.search({
      query: `metadata[\'customer\']:'${customerId}' AND status:'active'`,
    })).data;
  }

  async cancelSubscription(customerId: string, productId: number) {
    const subscription = await this.getSubscriptionByCustomerAndProductId(customerId, productId);
    await this.stripe.subscriptions.cancel(
      subscription.id,
    );
  }

  async getSubscriptionByCustomerAndProductId(customerId: string, productId: number) {
    return (await this.stripe.subscriptions.search({
      query: `metadata[\'customer\']:'${customerId}' AND metadata[\'product\']:'${productId}' AND status:'active'`,
    })).data[0];
  }

  private async checkIsProductsSubscriptionExist(customerId: string, productId: number) {
    const subscriptions = await this.stripe.subscriptions.search({
      query: `metadata[\'customer\']:'${customerId}' AND metadata[\'product\']:'${productId}' AND status:'active'`,
    });
    return !!subscriptions.data.length;
  }

  private async getProductRecurringPrice(productId: string, productPrice: number) {
    const price = await this.stripe.prices.search({
      query: `product:"${productId}" AND type:"recurring"`,
    });
    if (price.data.length) {
      return price.data[0];
    }
    return await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: productPrice * 100,
      recurring: {
        interval: 'month',
      },
      product: productId
    });
  }

  private async queryProductById(id: number) {
    const products = await this.stripe.products.search({
      query: `name:${id}`
    });
    return products.data[0];
  }
}

export default new StripeService();
