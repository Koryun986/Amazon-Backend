import {NextFunction, Request, Response} from "express";
import webhookService from "../services/webhook-service";

class WebhookController {
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'];
      await webhookService.webhook(req.body, sig);
      return res.json();
    } catch (e) {
      next(e);
    }
  }
}

export default new WebhookController();
