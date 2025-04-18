import { Message } from "kafkajs";

export interface MessageDispatcherInterface {
    dispatch(topic: string, message: Message): void;
}
