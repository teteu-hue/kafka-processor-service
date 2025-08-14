export interface INotificationMessage {
    title: string;
    content: string;
    level: MESSAGE_LEVEL;
    timestamp?: Date;
    channel?: string;
}

export enum MESSAGE_LEVEL {
    success = 'Successed!',
    info = 'INFO',
    warning = 'WARNING!',
    error = 'ERROR!'
}
