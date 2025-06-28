import ConsumerService from '../services/kafka/services/ConsumerService';
import { OrderRepository } from '../domains/orders/repository/OrderRepository';
import { OrderProcessRepository } from '../domains/orders/repository/OrderProcessRepository';

jest.mock('../domains/orders/repository/OrderRepository');
jest.mock('../domains/orders/repository/OrderProcessRepository');
jest.mock('../services/kafka/Consumer/ConsumerConfig', () => ({
  createConsumer: jest.fn().mockResolvedValue({
    run: jest.fn().mockResolvedValue(true)
  }),
  disconnectConsumer: jest.fn().mockResolvedValue(true)
}));

describe('ConsumerService', () => {
  let consumerService: any;
  let mockOrderRepository: any;
  let mockOrderProcessRepository: any;

  beforeEach(() => {
    mockOrderRepository = new (OrderRepository as any)();
    mockOrderProcessRepository = new (OrderProcessRepository as any)();
    consumerService = new ConsumerService(mockOrderRepository, mockOrderProcessRepository);
  });

  it('deve instanciar o serviço corretamente', () => {
    expect(consumerService).toBeDefined();
  });

  // Adicione mais testes unitários conforme necessário
});
