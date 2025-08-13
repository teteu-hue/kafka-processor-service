import { INotificationMessage } from "./INotificationMessage";

export interface INotificationStrategy {
    send(message: string): void;
    mountMessage(message: INotificationMessage): string;
}