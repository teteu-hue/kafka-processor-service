import { model } from "mongoose";
import { orderProcessStatusSchema } from "./OrderProcessStatusSchema";
import { OrderProcessStatus } from "./OrderProcessStatus";

const OrderProcessStatusModel = model<OrderProcessStatus>("OrderProcessStatus", orderProcessStatusSchema);

export default OrderProcessStatusModel;
