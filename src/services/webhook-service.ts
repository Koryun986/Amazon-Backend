import stripeService from "./stripe-service";
import {Product} from "../database/models/product";

class WebhookService {
  async webhook(data: any, sig: string | string[]) {
    const event = stripeService.constructEvent(data, sig);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        await this.paymentIntentSucceed(paymentIntentSucceeded);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async paymentIntentSucceed(data: any) {
    const products: {id: number, count: number}[] = data.metadata?.products && JSON.parse(data.metadata.products);
    if (!products) {
      return;
    }
    for(const product of products) {
      const productEntity = await Product.findByPk(product.id);
      if (!productEntity) {
        continue;
      }
      productEntity.time_bought += product.count;
      productEntity.total_earnings += productEntity.price * product.count;
      await productEntity.save();
    }
  }
}

export default new WebhookService();
