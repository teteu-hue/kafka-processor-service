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

    upsert = async( orderData: OrderProcessStatus): Promise<void> => {
        const orderProcess = await OrderProcessStatusModel.findOne({ clientID: orderData?.clientID, orderID: orderData?.orderID });

        if(!orderProcess) {
            await this.create(orderData);
            return;
        }

        return;
    }
};
