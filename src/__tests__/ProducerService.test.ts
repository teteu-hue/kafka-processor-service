import ProducerService from '../services/kafka/services/ProducerService';
import { Message } from 'kafkajs';

jest.mock('../services/kafka/Producer/ProducerConfig', () => ({
  createProducer: jest.fn().mockResolvedValue({
    send: jest.fn().mockResolvedValue(true)
  }),
  disconnectProducer: jest.fn().mockResolvedValue(true)
}));
jest.mock('../services/kafka/KafkaConfig', () => ({
  criarTopico: jest.fn().mockResolvedValue(true)
}));

describe('ProducerService', () => {
  it('deve enviar mensagem para o Kafka com sucesso', async () => {
    const service = new ProducerService();
    const result = await service.ProduceMessage('test-topic', { value: 'msg' } as Message);
    expect(result).toBe(true);
  });

  it('deve lançar erro ao falhar', async () => {
    const service = new ProducerService();
    // Simula erro
    jest.spyOn(service as any, 'handleErrors').mockImplementation(() => { throw new Error('fail'); });
    await expect(service.ProduceMessage('test-topic', { value: 'msg' } as Message)).rejects.toThrow();
  });
});
