import { Request, Response } from 'express';
import { orderRepository } from '../repository/OrderRepository';

export default class OrderController {
  static async getOrderQuantityByClient(req: Request, res: Response) {
    const { clienteId } = req.params;
    const clientID = Number(clienteId);
    
    if (isNaN(clientID)) return res.status(400).json({ error: 'ID inválido' });
    
    const orders = await orderRepository.findAll();
    const quantidadePedidos = orders.filter(order => order.clientID === clientID).length;
    return res.json({ clienteId: clientID, quantidadePedidos });
  }

  static async getOrderListByClient(req: Request, res: Response) {
    const { clienteId } = req.params;
    const clientID = Number(clienteId);
    
    if (isNaN(clientID)) return res.status(400).json({ error: 'ID inválido' });
    
    const orders = await orderRepository.findAll();
    const pedidos = orders.filter(order => order.clientID === clientID).map(order => {
      const valorTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      return {
        codigoPedido: order.orderID,
        valorTotal: Number(valorTotal.toFixed(2)),
        itens: order.items
      };
    });
    return res.json(pedidos);
  }

  static async getOrderTotalByCodigo(req: Request, res: Response) {
    const { codigoPedido } = req.params;
    const orderID = Number(codigoPedido);
    if (isNaN(orderID)) return res.status(400).json({ error: 'Código inválido' });
    
    const orders = await orderRepository.findAll();
    const pedido = orders.find(order => order.orderID === orderID);
    
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    
    const valorTotal = pedido.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return res.json({ codigoPedido: pedido.orderID, valorTotal: Number(valorTotal.toFixed(2)) });
  }
}
