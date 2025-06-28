interface DetailsLog {
    ip?: string;
    userAgent?: string;
    timestamp?: string;
    userId?: string;
    orderId?: string;
    [key: string]: any;
}

export interface LogMeta {
    action?: string;
    success?: boolean;
    details?: DetailsLog
    createdAt: string;
}
