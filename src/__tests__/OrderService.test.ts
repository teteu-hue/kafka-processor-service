import OrderService from '../domains/orders/services/OrderService';
import { OrderRepository } from '../repository/OrderRepository';
import { OrderProcessRepository } from '../model/orderProcess/OrderProcessRepository';
import kafkaMessageDispatcher from '../services/kafka/KafkaMessageDispatcher';
import { Log } from '../logger/Log';
import { Encryption } from '../encryption';

import '@types/jest';

// Mocks
jest.mock('../repository/OrderRepository');
jest.mock('../model/orderProcess/OrderProcessRepository');
jest.mock('../services/kafka/KafkaMessageDispatcher');
jest.mock('../logger/Log');
jest.mock('../encryption');

const mockOrderRepository = new OrderRepository() as jest.Mocked<OrderRepository>;
const mockOrderProcessRepository = new OrderProcessRepository() as jest.Mocked<OrderProcessRepository>;
const mockKafkaMessageDispatcher = kafkaMessageDispatcher as jest.Mocked<typeof kafkaMessageDispatcher>;
const mockLog = Log as jest.Mocked<typeof Log>;
const mockEncryption = Encryption as jest.Mocked<typeof Encryption>;

const orderService = new OrderService();

describe('OrderService', () => {
  describe('createOrder', () => {
    it('deve criar um pedido com sucesso', async () => {
      const fakeOrder = { id: 1, name: 'Pedido Teste' } as any;
      const createdOrder = { ...fakeOrder, created: true };
      mockOrderRepository.create.mockResolvedValue(createdOrder);

      const result = await orderService.createOrder(fakeOrder);
      expect(result).toEqual(createdOrder);
      expect(mockOrderRepository.create).toHaveBeenCalledWith(fakeOrder);
    });

    it('deve retornar false se não criar o pedido', async () => {
      mockOrderRepository.create.mockResolvedValue(undefined);
      const result = await orderService.createOrder({} as any);
      expect(result).toBe(false);
    });

    it('deve lançar erro se ocorrer exceção', async () => {
      mockOrderRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(orderService.createOrder({} as any)).rejects.toThrow('DB error');
    });
  });

  describe('produceOrders', () => {
    const topicName = 'test-topic';
    const fakeOrder = {
      orderID: '1',
      clientID: 'client1',
      status_order: 'paid',
      grossValue: 100,
      items: [{ id: 'item1', value: 50 }],
      created_at: '2025-06-15T00:00:00Z',
    };
    const fakeMessage = { value: fakeOrder } as any;

    beforeEach(() => {
      jest.clearAllMocks();
      mockEncryption.encrypt.mockImplementation((v) => `encrypted:${v}`);
      mockKafkaMessageDispatcher.dispatch.mockResolvedValue(undefined);
      mockOrderProcessRepository.create.mockResolvedValue({ ...fakeOrder, _id: 'abc' });
    });

    it('deve processar e despachar pedidos com sucesso', async () => {
      await orderService.produceOrders(topicName, [fakeMessage]);
      expect(mockKafkaMessageDispatcher.dispatch).toHaveBeenCalledWith(
        topicName,
        expect.objectContaining({ value: expect.stringContaining('encrypted:') })
      );
      expect(mockOrderProcessRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ orderID: '1', process_status_order: expect.any(String) })
      );
      expect(mockLog.info).toHaveBeenCalledWith(
        expect.stringContaining('Order sent to kafka with success'),
        expect.any(Object)
      );
    });

    it('deve pular mensagens sem valor', async () => {
      const msg = { value: undefined };
      await orderService.produceOrders(topicName, [msg as any]);
      expect(mockKafkaMessageDispatcher.dispatch).not.toHaveBeenCalled();
      expect(mockLog.kafkaMessage).toHaveBeenCalledWith(
        expect.stringContaining('Message value is not informed'),
        expect.any(Object)
      );
    });

    it('deve logar erro se não criar status do processo', async () => {
      mockOrderProcessRepository.create.mockResolvedValue(undefined);
      await orderService.produceOrders(topicName, [fakeMessage]);
      expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('Order process status not created'),
        expect.any(Object)
      );
    });

    it('deve lançar erro e logar se ocorrer exceção', async () => {
      mockKafkaMessageDispatcher.dispatch.mockRejectedValue(new Error('Kafka error'));
      await expect(orderService.produceOrders(topicName, [fakeMessage])).rejects.toThrow('Kafka error');
      expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('Error while processing orders!'),
        expect.any(Object)
      );
    });
  });
});
