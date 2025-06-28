import { Router } from 'express';
import OrderWebhookController from '../webhooks/OrderWebhookController';

const webhookRouter: Router = Router();

webhookRouter.post('/webhook/orders', OrderWebhookController.index);

export default webhookRouter;
