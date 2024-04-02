import Stripe from "stripe";
import {STRIPE_SECRET_KEY} from "../config/envirenmentVariables";

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

  async buyProduct(id: number, count: number, requestUrl: string) {
    const product = await this.queryProductById(id);
    return await this.stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: product.default_price,
          quantity: count,
        }
      ],
      mode: "payment",
      return_url:
        `${requestUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  }

  async createPrice(id: number | string, price:number) {
    return await this.stripe.prices.create({
      currency: "usd",
      unit_amount: price * 100,
      product: id
    });
  }

  private async queryProductById(id: number) {
    const products = await this.stripe.products.search({
      query: `name:${id}`
    });
    console.log(products, "products");
    return products.data[0];
  }
}

export default new StripeService();