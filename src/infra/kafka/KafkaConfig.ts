import { KafkaConfig, Kafka, logLevel, Partitioners } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
    clientId: 'myApp',
    brokers: ['kafka:9092'],
    logLevel: logLevel.INFO,
    createPartitioner: Partitioners.LegacyPartitioner,
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
    // Se precisar de metadados confiáveis
    requestTimeout: 30000
};

const kafka = new Kafka(kafkaConfig);

async function criarTopico(topico: string) {
    const admin = kafka.admin();
    await admin.connect();
    
    try {
        await admin.createTopics({
            topics: [{ topic: topico, numPartitions: 1, replicationFactor: 1 }]
        });
        console.log(`Tópico ${topico} criado com sucesso!`);
    } catch (error) {
        console.error(`Erro ao criar tópico ${topico}: `, error);
    } finally {
        await admin.disconnect();
    }
}

export { kafka, criarTopico };
