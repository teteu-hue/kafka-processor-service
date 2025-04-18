export interface OrderItem {
    product: string;
    quantity: number;
    price: number
}

export interface Order {
    _id?: string;
    orderID: number;
    clientID: number;
    grossValue: number;
    items: OrderItem[];
    created_at: string;
    createdAt?: string;
    updatedAt?: string;
}
