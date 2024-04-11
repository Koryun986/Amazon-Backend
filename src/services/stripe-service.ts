import Stripe from "stripe";
import {STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET} from "../config/envirenmentVariables";
import {UserDto} from "../dtos/user-dto";

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

  async getCustomer(userDto: UserDto) {
    let customer = await this.stripe.customers.search({
      query: `email:'${userDto.email}'`,
    });
    if (!customer?.data?.length) {
      return await this.createCustomer(userDto);
    }
    return customer.data[0];
  }

  async createCustomer(userDto: UserDto) {
    return await this.stripe.customers.create({
      name: `${userDto.first_name} ${userDto.last_name}`,
      email: userDto.email,
    });
  }

  async buyProduct(amount: number, productsInfo: {id: number, count: number}[], userDto: UserDto) {
    const customer = await this.getCustomer(userDto);
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customer.id,
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
    const payments = await this.getUserPayments(userDto);
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

  async getUserPayments(userDto: UserDto) {
    const customer = await this.getCustomer(userDto);
    return (await this.stripe.paymentIntents.search({
      query: `customer:'${customer.id}'`,
    })).data;
  }

  async getCustomersOrderedProducts(userDto: UserDto) {
    const payments = await this.getUserCompletedPayments(userDto);
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

  async getUserCompletedPayments(userDto: UserDto) {
    const customer = await this.getCustomer(userDto);
    return (await this.stripe.paymentIntents.search({
      query: `customer:'${customer.id}' AND status:'succeeded'`,
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

  private async queryProductById(id: number) {
    const products = await this.stripe.products.search({
      query: `name:${id}`
    });
    return products.data[0];
  }
}

export default new StripeService();
