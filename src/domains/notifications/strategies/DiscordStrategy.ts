import { INotificationMessage } from "../interfaces/INotificationMessage";
import { INotificationStrategy } from "../interfaces/INotificationStrategy";
import 'dotenv/config';

class DiscordStrategy implements INotificationStrategy {
    send(message: string): void {
        throw new Error("Method not implemented.");
    }

    mountMessage(message: INotificationMessage): string {
        return "";
    }
    
}



