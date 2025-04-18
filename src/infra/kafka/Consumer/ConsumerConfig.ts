import { Consumer, ConsumerConfig } from 'kafkajs';
import { kafka } from '../KafkaConfig';
import { Log } from '../../../shared/logger/Log';

const createConsumer = async(groupId: string, topics: string[]): Promise<Consumer> => {
    const consumerConfig: ConsumerConfig = {
        groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        retry: {
            initialRetryTime: 300,
            retries: 10
        }
    };

    try {
        const consumer: Consumer = kafka.consumer(consumerConfig);
        await consumer.connect();
        Log.info("Consumer connected successfully!", {
            action: "ConsumerConfig.createConsumer",
            createdAt: new Date().toISOString(),
            success: true
        });
        await subscribeTopics(consumer, topics);
        return consumer;
    } catch(e) {
        const error = e instanceof Error ? e.message : "Erro desconhecido!";
        Log.error("Consumer configuration FAILED!", {
            action: "ConsumerConfig.createConsumer",
            createdAt: new Date().toISOString(),
            success: false,
            details: {
                error: error
            }
        });
        throw new Error(`Consumer configuration FAILED! => ${error}`);
    }
}

const subscribeTopics = async (consumer: Consumer, topics: string[]) => {
    for(const topic of topics) {
        await consumer.subscribe({topic, fromBeginning: true});
    }
    Log.info("Topics subscribed successfully!", {
        action: "ConsumerConfig.subscribeTopics",
        createdAt: new Date().toISOString(),
        success: true
    });
}

const disconnectConsumer = async(consumer: Consumer): Promise<void> => {
    await consumer.disconnect();
    Log.info("Consumer disconnected successfully!", {
        action: "ConsumerConfig.disconnectConsumer",
        createdAt: new Date().toISOString(),
        success: true
    });
}

export { createConsumer, disconnectConsumer };