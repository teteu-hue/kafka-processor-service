import { IValueMessagePayload } from "../../Interface/DomainInterfaces";
import {
  createConsumer,
  disconnectConsumer,
} from "../Consumer/ConsumerConfig";
import { Consumer } from "kafkajs";
import { OrderRepository } from "../../../domains/orders/repository/OrderRepository";
import { LogMeta } from "../../../shared/logger/LogMeta";
import { Log } from "../../../shared/logger/Log";
import { OrderProcessRepository } from "../../../domains/orders/repository/OrderProcessRepository";
import { Encryption } from "../../../shared/encryption/index";

export default class OrderConsumerService {
  private consumer: Consumer | null = null;
  private isRunning: boolean = false;

  constructor(
    private orderRepository: OrderRepository,
    private orderProcessRepository: OrderProcessRepository
  ) {}

  DisconnectActualConsumer = async() => {
    if (this.consumer) {
        try {
          await disconnectConsumer(this.consumer);
        } catch (e) {
          console.warn("Erro ao desconectar consumer", e);
          throw new Error("Erro ao desconectar o consumer atual");
        }
      }
  }

  ConsumeMessage = async (groupId: string, topics: string[]) => {
    this.isRunning = true;

    const connect = async () => {
      try {
        await this.DisconnectActualConsumer();
        this.consumer = await createConsumer(groupId, topics);
        Log.info("Consumer conectado e rodando!", {
          action: "ConsumerService.ConsumeMessage",
          createdAt: new Date().toISOString(),
          success: true,
          details: {
            groupId: groupId,
            topics: topics,
            consumer: this.consumer
          }
        });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              
              const order: IValueMessagePayload = message.value ? JSON.parse(Encryption.decrypt(message.value.toString())) : '';
              if(!order) {
                Log.info("Não foi informado um valor no pedido", {
                  action: "ConsumerService.ConsumeMessage",
                  createdAt: new Date().toISOString(),
                  success: true,
                  details: {
                    orderData: order,
                    topic: topic
                  }
                });
                return;
              }
              
              if(order.status_order !== "paid") {
                Log.info("O pedido não está pago, e não será processado!", {
                  action: "ConsumerService.ConsumeMessage",
                  createdAt: new Date().toISOString(),
                  success: true,
                  details: {
                    orderData: order,
                    topic: topic
                  }
                });
                return;
              }

              try {

                // Implementar upsert
                  const createdOrder = await this.orderRepository.create(order);
                  if(createdOrder) {
                    const metaLog: LogMeta = {
                      action: "ConsumerService.ConsumeMessage",
                      createdAt: new Date().toISOString(),
                      success: true,
                      details: {
                        orderData: order,
                        topic: topic
                      }
                    }
                    Log.info("Dados persistidos para o banco de dados!", metaLog);
                  }

                  const orderProcess = await this.orderProcessRepository.findByOrderId(createdOrder.orderID);

                  if(!orderProcess) {
                    const metaLog: LogMeta = {
                      action: "ConsumerService.ConsumeMessage",
                      createdAt: new Date().toISOString(),
                      success: true,
                      details: {
                        orderData: orderProcess,
                        topic: topic
                      }
                    }
                    Log.info("Falha ao processar o pedido!", metaLog);
                    return;
                  }
                  
                  // Já verifico se o status não tem o status de pago, essa validação é desnecessária.
                  // Implementar uma nova forma.
                  if(order.status_order === "paid") {
                    await this.orderProcessRepository.updateStatusToProcessed(orderProcess._id);
                    const metaLog: LogMeta = {
                      action: "ConsumerService.ConsumeMessage",
                      createdAt: new Date().toISOString(),
                      success: true,
                      details: {
                        orderData: orderProcess,
                        topic: topic
                      }
                    }
                    Log.info("Pedido processado com sucesso!", metaLog);
                  }


              } catch (err) {
                  const metaLog: LogMeta = {
                    action: "ConsumerService.ConsumeMessage",
                    createdAt: new Date().toISOString(),
                    success: false,
                    details: {
                      error: err,
                      orderData: order,
                      topic: topic
                    }
                  }
                  Log.error("Erro ao processar mensagem:", metaLog);
              }
            }
        });
        
      } catch(e) {
        const error = e instanceof Error ? e.message : "Erro desconhecido!" ;

        if(this.isRunning) {
            Log.error("Ocorreu algum erro de conexão, tentando reconectar no serviço Kafka!", {
              action: "ConsumerService.ConsumeMessage",
              createdAt: new Date().toISOString(),
              success: false,
              details: {
                message: error
              }
            });
            setTimeout(connect, 5000);
        }
      }
    };

    await connect();

    process.on('SIGINT', async() => {
        this.isRunning = false;
        if(this.consumer) {
            await this.DisconnectActualConsumer();
        }
    });
  };

  stop = async () => {
    this.isRunning = false;
    if(this.consumer) {
        await this.DisconnectActualConsumer();
        this.consumer = null;
        Log.info("Consumer parado manualmente", {
          action: "ConsumerService.stop",
          createdAt: new Date().toISOString(),
          success: true
        });
    }
  }
}
