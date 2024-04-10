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
      return await this.stripe.customers.create({
        name: `${userDto.first_name} ${userDto.last_name}`,
        email: userDto.email,
      });
    }
    return customer.data[0];
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

  async getCustomersOrderedProducts(userDto: UserDto) {
    const payments = await this.getUserPayments(userDto);
    return payments.reduce((acc, cur) => {
      if (!cur.metadata?.products) {
        return acc;
      }
      const products = JSON.parse(cur.metadata.products).map(product => ({...product, status: cur.status, date: cur.created}));
      return [...acc, ...products];
    }, [])
  }

  async getUserPayments(userDto: UserDto) {
    const customer = await this.getCustomer(userDto);
    return (await this.stripe.paymentIntents.search({
      query: `customer:'${customer.id}'`,
    })).data;
  }

  constructEvent(data: any, sig: string | string[]) {
    return this.stripe.webhooks.constructEvent(data, sig, STRIPE_WEBHOOK_ENDPOINT_SECRET);
  }

  private async queryProductById(id: number) {
    const products = await this.stripe.products.search({
      query: `name:${id}`
    });
    return products.data[0];
  }
}

export default new StripeService();
