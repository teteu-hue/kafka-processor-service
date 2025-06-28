import { OrderProcessStatus } from "../model/orderProcess/OrderProcessStatus";
import OrderProcessStatusModel from "../model/orderProcess/orderProcessStatusModel";

export class OrderProcessRepository {

    create = async(orderProcessStatus: OrderProcessStatus) => {
        try {
            const order = await OrderProcessStatusModel.create(orderProcessStatus);
            return order;
        } catch(e) {
            throw new Error(e instanceof Error ? e.message : "Erro ao criar o registro de processamento de pedido");
        }
    }

    findByOrderId = async(id: number) => {
        try {
            const orderProcess = await OrderProcessStatusModel.findOne({ orderID: id });
            return orderProcess;
        } catch(e) {
            throw new Error(e instanceof Error ? e.message : "Erro ao buscar o registro de processamento de pedido");
        }
    }

    updateStatusToProcessed = async(id: string) => {
        try {
            const orderProcess = await OrderProcessStatusModel.findByIdAndUpdate(id, { process_status_order: "Processed" });
            return orderProcess;
        } catch(e) {
            throw new Error(e instanceof Error ? e.message : "Erro ao atualizar o status do registro de processamento de pedido");
        }
    }

    insertIfNotExists = async( orderData: OrderProcessStatus): Promise<Array<String | OrderProcessStatus>> => {
        const orderProcess = await OrderProcessStatusModel.findOne({ _id: orderData._id, orderID: orderData.orderID });

        if(!orderProcess) {
            const newOrderProcess = await this.create(orderData);
            return ['notExists', newOrderProcess];
        }

        return ['exists', orderProcess];
    }
};
