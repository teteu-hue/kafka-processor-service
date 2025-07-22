import { Message } from "kafkajs";
import { Order } from "../../../model/pedido/Order";
import { OrderRepository } from "../repository/OrderRepository";
import kafkaMessageDispatcher from "../../../infra/kafka/KafkaMessageDispatcher";
import { OrderProcessRepository } from "../repository/OrderProcessRepository";
import { OrderProcessStatus, ProcessStatus } from "../model/orderProcess/OrderProcessStatus";
import { Log } from "../../../shared/logger/Log"
import { LogMeta } from "../../../shared/logger/LogMeta";
import { Encryption } from "../../../shared/encryption";

class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private orderProcessRepository: OrderProcessRepository
    ) { }

    produceOrders = async (topicName: string, messages: Message[]) => {
        Log.info("Initialize processing orders from topic in OrderService.processOrders");
        try {
            for (const message of messages) {
                
                if (!message.value) {
                    Log.kafkaMessage("Message value is not informed in request!", {
                        action: "OrderService.processOrders",
                        createdAt: new Date().toISOString(),
                        details: {
                            key: message.key?.toString(),
                            message: message.value?.toString()
                        }
                    });
                    continue;
                }
                
                const { 
                    orderID, 
                    clientID, 
                    status_order, 
                    grossValue, 
                    items, 
                    created_at 
                } = JSON.parse(JSON.stringify(message.value));

                await kafkaMessageDispatcher.dispatch(topicName, {
                    ...message,
                    value: Encryption.encrypt(JSON.stringify(message.value)),
                });
                
                const orderProcessStatus: OrderProcessStatus = {
                    orderID,
                    clientID,
                    status_order,
                    process_status_order: ProcessStatus.PENDING
                };

                await this.orderProcessRepository.upsert(orderProcessStatus);

                const metaLog: LogMeta = {
                    action: 'OrderService.produceOrders',
                    createdAt: new Date().toISOString(),
                    success: true,
                    details: {
                        orderData: {
                            orderID,
                            clientID,
                            status_order,
                            grossValue,
                            items,
                            created_at
                        }
                    }
                }
                Log.info('Order sent to kafka with success in orderService.produceOrders', metaLog);
            }
        } catch (e) {
            const metaLog: LogMeta =  {
                action: "OrderService.processOrders",
                createdAt: new Date().toISOString(),
                success: false,
                details: {
                    error: e instanceof Error ? e.message : 'Unknown error'
                }
            }
            Log.error("Error while processing orders!", metaLog);
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }
}

const orderService = new OrderService(new OrderRepository, new OrderProcessRepository);
export default orderService;