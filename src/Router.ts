import { app } from './server';
import orderRouter from './domains/orders/router/orders.router';
import OrderConsumerService from './infra/kafka/services/OrderConsumerService';
import { OrderRepository } from './domains/orders/repository/OrderRepository';
import webhookRouter from './domains/orders/router/webhook.router';
import { OrderProcessRepository } from './domains/orders/repository/OrderProcessRepository';

import DiscordClient from './domains/notifications/services/Discord/DiscordClient';

const discordClient = new DiscordClient();

app.use(orderRouter);
app.use(webhookRouter);

app.get('/', async (req: Request, res: Response) => {

    discordClient.setData({
        "order_status": "Hello world!",
        "message": "Hello world!",
        "order_id": "Hello world!",
        "level": "Hello world!",
        "date_time": "Hello world!"
    });
    
    const response = await discordClient.sendMessage([
        "order_status",
        "message",
        "order_id",
        "level",
        "date_time"
    ]);
    console.log(response);
    res.send(response);
});

app.listen(3000, () => {
    new OrderConsumerService(new OrderRepository, new OrderProcessRepository).ConsumeMessage('my-group', ['orders']).catch(e => console.error(`Error in consumer`));
});
