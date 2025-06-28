import { model } from 'mongoose';
import { orderSchema } from './OrderSchema';
import { Order } from './Order';

const OrderModel = model<Order>('orders', orderSchema);

export default OrderModel;
