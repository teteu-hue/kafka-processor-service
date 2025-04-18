export default class KafkaMessageError extends Error {
    code?: string;
    customer_id?: number;
    
    constructor(message?: string, code?: string, customer_id?: number){
        super(message);

        this.name = "KafkaMessageError";
        this.code = code;
        this.customer_id = customer_id;

        Object.setPrototypeOf(this, KafkaMessageError.prototype);
    }

    
}