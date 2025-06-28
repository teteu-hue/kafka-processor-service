import OrderModel from "../model/pedido/OrderModel";
import { Order } from "../model/pedido/Order";

export class OrderRepository {
    create = async (orderData: Order) : Promise<Order> => {
        try {
            const order = await OrderModel.create(orderData);

            return order;
        } catch(e) {
            throw new Error(`OrderRepository => ${e}`);
        }
    }

    findAll = async(): Promise<Order[]> => {
        try {
            const orders = await OrderModel.find().exec();
            return orders;
        } catch(e) {
            throw new Error("Error => " + e);
        }
    }

    findById = async(id: string): Promise<Order | Error> => {
        const order = await OrderModel.findById(id).exec();

        if(!order) {
            throw new Error("Order is not found!");
        }
        return order;
    }

    update = async(id: string, orderData: Partial<Order>): Promise<Order> => {
        const order = await OrderModel.findByIdAndUpdate(id, orderData, { new: true }).exec();

        if(!order) {
            throw new Error("Order is not found!");
        }
        return order;
    }
    
    delete = async(id: string): Promise<boolean> => {
        const result = await OrderModel.deleteOne( {_id: id} ).exec();
        return result.deletedCount === 1;
    }

    insertIfNotExists = async(orderData: Order): Promise<Array<String | Order>> => {
        const order = await OrderModel.findOne({_id: orderData._id, clientID: orderData.clientID});

        if(!order) {
            const newOrder = await this.create(orderData);

            return ['notExists', newOrder];
        }

        return ['exists', order];
    }
}

const orderRepository = new OrderRepository();

export { orderRepository };
