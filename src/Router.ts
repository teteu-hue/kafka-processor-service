import { app } from './server';
import orderRouter from './domains/orders/router/orders.router';
import OrderConsumerService from './infra/kafka/services/OrderConsumerService';
import { OrderRepository } from './domains/orders/repository/OrderRepository';
import webhookRouter from './domains/orders/router/webhook.router';
import { OrderProcessRepository } from './domains/orders/repository/OrderProcessRepository';

app.use(orderRouter);
app.use(webhookRouter);

app.listen(3000, () => {
    new OrderConsumerService(new OrderRepository, new OrderProcessRepository).ConsumeMessage('my-group', ['orders']).catch(e => console.error(`Error in consumer`));
});
