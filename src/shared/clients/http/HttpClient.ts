import { Log } from "../../logger/Log";

/**
 * HttpClient is a class that provides a simple interface for making HTTP requests.
 * It is used to make requests to the API.
 * 
 * How to use: 
 * const httpClient = new HttpClient('https://api.example.com');
 * httpClient.setHeader('Authorization', 'Bearer ' + token);
 * httpClient.setData({ name: 'John', age: 30 });
 * const response = await httpClient.get('/users');
 * return response; 
 */
class HttpClient {
    
    /**
     * The base URL of the API.
     */
    protected url: string;

    /**
     * The headers of the API.
     * Used to send the headers to the API. 
     */
    protected headers: Record<string, string>;

    /**
     * The data of the API.
     * Used to send the data to the API.
     */
    protected data: Record<string, string>;

    /**
     * The methods of the API.
     * Used to send the methods to the API.
     */
    private methods = ['GET', 'POST', 'PUT', 'DELETE'];

    constructor() {
        this.url = "";
        this.headers = {};
        this.data = {};
    }

    /**
     * Set a header for the API.
     * @param key The key of the header.
     * @param value The value of the header.
     */
    setHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    setData(data: Record<string, string>) {
        this.data = data;
        return JSON.stringify(this.data);
    }

    /**
     * Request a resource from the API.
     * @param url The URL of the resource to request.
     * @param method The method to use.
     * @param data The data to send to the API.
     * @param headers The headers to send to the API.
     * @returns The response from API or throws an error if the request fails.
     */
    async request(method: string, data: Record<string, string>): Promise<Response | Error> {
        const methodFinded = this.methods.find(m => m === method.toUpperCase());

        if(!methodFinded) {
            const errorMessage = `Method ${method} is not supported. Supported methods are: ${this.methods.join(', ')}`;
            Log.error(errorMessage, {
                action: 'HttpClient.request',
                createdAt: new Date().toISOString(),
                success: false,
                details: {
                    method: method,
                    url: url,
                    data: this.data,
                    headers: this.headers,
                }
            });
            throw new Error(errorMessage);
        }

        try {
            console.log("DATA =>", JSON.stringify(data));
            const httpClientBody: IHttpClientBody = {
                method: method,
                body: JSON.stringify(data),
                headers: this.headers,
            }

            console.log(httpClientBody);

            const response = await fetch(`${this.url}`, httpClientBody);
            return response;

        } catch (error) {
            
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            Log.error(errorMessage, {
                action: 'HttpClient.request',
                createdAt: new Date().toISOString(),
                success: false,
                details: {
                    method: method,
                    url: this.url,
                    data: this.data,
                    headers: this.headers,
                    error: errorMessage,
                }
            });
            throw errorMessage;
        }
    }
}   

export interface IHttpClientBody {
    method: string;
    body?: string;
    headers: Record<string, string>;
}

export default HttpClient;
