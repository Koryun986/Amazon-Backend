import stripeService from "./stripe-service";
import {Product} from "../database/models/product";
import sequelize from "../database/index";
import {CartItem} from "../database/models/cart-item";

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
    const transaction = await sequelize.startUnmanagedTransaction();
    try {
      for(const product of products) {
        const productEntity = await Product.findByPk(product.id);
        if (!productEntity) {
          continue;
        }
        productEntity.time_bought += product.count;
        productEntity.total_earnings += productEntity.price * product.count;
        await productEntity.save();
        await CartItem.destroy({where: {product_id: product.id}});
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  }
}

export default new WebhookService();
