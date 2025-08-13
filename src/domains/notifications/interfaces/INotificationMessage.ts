export interface INotificationMessage {
    title: string;
    content: string;
    level: MESSAGE_LEVEL;
    timestamp?: Date;
    channel?: string;
}

export enum MESSAGE_LEVEL {
    success = 'success',
    info = 'info',
    warning = 'warning',
    error = 'error'
}
