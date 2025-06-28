import { Message } from "kafkajs";
import ProducerService from "./services/ProducerService";
import KafkaMessageError from "./error/KafkaMessageError";
import { MessageDispatcherInterface } from "../Interface/MessageDispatcherInterface";
import { Log } from "../../shared/logger/Log";

class KafkaMessageDispatcher implements MessageDispatcherInterface {
    constructor(
        private producerService: ProducerService
    ){}

    async dispatch(topicName: string, message: Message) {
        try {
            
            await this.producerService.ProduceMessage(topicName, message);
            Log.info("Message dispatched to Kafka successfully!", {
                action: "KafkaMessageDispatcher.dispatch",
                createdAt: new Date().toISOString(),
                success: true
            });
            return;
        } catch(e) {
            const error = e instanceof Error ? e.message : "Erro desconhecido!";
            Log.error("Failed to send message to Kafka:", {
                action: "KafkaMessageDispatcher.dispatch",
                createdAt: new Date().toISOString(),
                success: false,
                details: {
                    error: error
                }
            });
            throw new KafkaMessageError("Falha ao enviar mensagem para o Kafka algum erro ocorreu! =>" + error, "500");
        }
    }
}

const kafkaMessageDispatcher = new KafkaMessageDispatcher(new ProducerService());
export default kafkaMessageDispatcher;
