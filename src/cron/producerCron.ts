import { CronJob } from "cron";
import axios from "axios";
import 'dotenv/config';
import {IProducerMessagePayload} from "../Interface/DomainInterfaces";

const api = axios.create({
    baseURL: process.env.producer_order_URL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
    }
});

const payload: IProducerMessagePayload = {
    "topicName": "orders",
    "messages": [
    {
      "key": "clientID",
      "value": {
        "orderID": 1001,
        "clientID": 1,
        "grossValue": 120,
        "items": [
          { "product": "lápis", "quantity": 100, "price": 1.1 },
          { "product": "caderno", "quantity": 10, "price": 1.0 }
        ],
        "status_order": "paid",
        "created_at": "2025-05-01T12:00:00Z"
      },
      "timestamp": "1746100800000"
    },
    {
      "key": "clientID",
      "value": {
        "orderID": 1002,
        "clientID": 2,
        "grossValue": 120,
        "items": [
          { "product": "Produto diferente", "quantity": 100, "price": 1.1 },
          { "product": "Esse produto foi consumido agora!", "quantity": 10, "price": 1.0 }
        ],
        "status_order": "paid",
        "created_at": "2025-05-02T12:00:00Z"
      },
      "timestamp": "1746187200000"
    },
    {
      "key": "clientID",
      "value": {
        "orderID": 1003,
        "clientID": 3,
        "grossValue": 120,
        "items": [
          { "product": "lápis", "quantity": 100, "price": 1.1 },
          { "product": "caderno", "quantity": 10, "price": 1.0 }
        ],
        "status_order": "paid",
        "created_at": "2025-05-03T12:00:00Z"
      },
      "timestamp": "1746273600000"
    },
    {
      "key": "clientID",
      "value": {
        "orderID": 1004,
        "clientID": 4,
        "grossValue": 120,
        "items": [
          { "product": "lápis", "quantity": 100, "price": 1.1 },
          { "product": "caderno", "quantity": 10, "price": 1.0 }
        ],
        "status_order": "paid",
        "created_at": "2025-05-03T12:00:00Z"
      },
      "timestamp": "1746273600000"
    }
  ]
};

const producerJob: CronJob = new CronJob(
    "* 1 * * * *",
    async function() {
        try {
            await api.post('webhook/orders', payload);
        } catch(e) {
            console.error(e);
        }
    }
);

export { producerJob };
