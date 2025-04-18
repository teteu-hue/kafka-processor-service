import { model, Schema } from "mongoose";
import { OrderProcessStatus, ProcessStatus } from "./OrderProcessStatus";

const orderProcessStatusSchema = new Schema<OrderProcessStatus>({
    orderID: { type: Number, required: true },
    clientID: { type: Number, required: true },
    status_order: { type: String, required: true },
    process_status_order: { 
        type: String, 
        required: true,
        enum: Object.values(ProcessStatus) 
    }
}, {
    timestamps: true,
    versionKey: false
})

export { orderProcessStatusSchema };
