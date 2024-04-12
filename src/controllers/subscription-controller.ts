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
}

export default new SubscriptionController();
