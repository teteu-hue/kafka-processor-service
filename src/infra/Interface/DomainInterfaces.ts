export interface IProducerMessagePayload {
    topicName: string;
    messages: IMessagePayload[];
}

export interface IMessagePayload {
    key: string;
    value: IValueMessagePayload;
    timestamp: string;
}

export interface IValueMessagePayload {
    orderID: number;
    clientID: number;
    grossValue: number;
    status_order: string;
    items: IItemsMessagePayload[];
    created_at: string;
}

export interface IItemsMessagePayload {
    product: string;
    quantity: number;
    price: number;
}
