import {NextFunction, Request, Response} from "express";
import subscriptionService from "../services/subscription-service";

class SubscriptionController {
  async subscribeProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const data = await subscriptionService.subscribeProduct(req.body, req.user);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async getSubscriptionsOfProduct(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const data = await subscriptionService.getSubscriptionsOfProduct(req.user);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      await subscriptionService.cancelSubscription(req.params.product_id, req.user);
      return res.json();
    } catch (e) {
      next(e);
    }
  }
}

export default new SubscriptionController();
