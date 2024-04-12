import {User} from "../database/models/user";
import {ApiError} from "../exceptions/api-error";
import {StripeCustomer} from "../database/models/stripe-customer";
import stripeService from "./stripe-service";
import type {UserDto} from "../dtos/user-dto";
import {Product} from "../database/models/product";

class SubscriptionService {
  async subscribeProduct(data: { product_id: number }, userDto: UserDto) {
    const userEntity = await User.findOne({where: {email: userDto.email}});
    if (!userEntity) {
      throw ApiError.UnauthorizedError();
    }
    const stripeCustomerEntity = await StripeCustomer.findOne({where: {user_id: userEntity.id}});
    const productEntity = await Product.findByPk(data.product_id, {include: {all: true}});
    const subscription = await stripeService.createProductSubscription(data.product_id, stripeCustomerEntity.stripe_customer_id, productEntity.price);
    return {
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      product: productEntity,
    };
  }
}

export default new SubscriptionService();
