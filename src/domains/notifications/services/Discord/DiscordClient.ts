import HttpClient from "../../../../shared/clients/http/HttpClient";
import 'dotenv/config';
import { MESSAGE_LEVEL } from "../../interfaces/INotificationMessage";

export default class DiscordClient extends HttpClient {

    constructor() {
        super();
        this.url = process.env.DISCORD_BASE_URL || "https://discord.com/api/webhooks/1351606675152437269/64zJTyTnmPeirc0t1GxGMEKpq12tA2ukC1kvWMrU5D20RXl_IW6kFnWnP75PNylSbAon";
        this.setHeader('Content-Type', 'application/json');
        this.message = DiscordMessages.content;
    }

    private message: string;

    setData(data: Record<string, string>) {
       return super.setData(data);
    }

    async sendMessage() {
        const data = {
            "content": this.message
        };
        try { 
            const response = await this.request("POST", data);
            console.log(response);
            return response;
        } catch (error) {
           let retry = 0;   
           let failed = true;

           do {

            try {
                console.log("Tentando novamente!");
                const response = await this.request("POST", this.data);
                if(response) {
                    failed = false;
                }

            } catch (error) {
                retry++;

            } finally {
                retry++;
            }

            

           } while (failed);
            
        }
    }

    mountMessage(bindValues: []) {
        return this.bindDataMessage('?', bindValues);
    }

    private bindDataMessage(operator: string, bindValues: []) {
        if(!this.message) {
            throw Error("Message is empty!");
        }

        for(let element = 0; element < bindValues.length; element++) {
            this.message = this.message.replace(operator, bindValues[element]);   
        }
        return this.message;
    }
}

export interface IDiscordMessage extends Record<string, string> {
    content: string;
}

const DiscordMessages: IDiscordMessage = {
    'content': `

    *Order processing status: ?
    
    *Message: ?

    *Order ID: ?
    *Level: ?
    *DateTime: ?
    `,
}
