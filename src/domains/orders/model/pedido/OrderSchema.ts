import { Schema } from 'mongoose';
import { Order, OrderItem } from './Order';

const orderItemSchema = new Schema<OrderItem>({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

export const orderSchema = new Schema<Order>({
    orderID: { type: Number, required: true },
    clientID: { type: Number, required: true },
    items: { type: [orderItemSchema], required: true }
}, {
    timestamps: true,
    versionKey: false
});
