import { Log } from '../shared/logger/Log';
import 'dotenv/config';
import mongoose from 'mongoose';

export async function openConnection() {
    const { DB_CONN_STRING } = process.env;

    if(!DB_CONN_STRING) {
        throw new Error("Please inform a DB_CONN_STRING in .env file!");
    }

    try {
        const options = {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000
        }
        
        await mongoose.connect(DB_CONN_STRING, options);
        Log.info("Connection has been established", {
            action: "MongoDB.openConnection",
            createdAt: new Date().toISOString(),
            success: true
        });

    } catch(e) {
        const error = e instanceof Error ? e.message : "Erro desconhecido!";
        Log.error("MongoDB Connection Error: ", {
            action: "MongoDB.openConnection",
            createdAt: new Date().toISOString(),
            success: false,
            details: {
                error: error
            }
        });
        throw new Error("Connection is not established => " + e);
    }
}

export async function closeConnection() {
    try {
        await mongoose.disconnect();
        Log.info("Connection closed!", {
            action: "MongoDB.closeConnection",
            createdAt: new Date().toISOString(),
            success: true
        });
    } catch(e) {
        const error = e instanceof Error ? e.message : "Erro desconhecido!";
        Log.error("Error closing MongoDB connection: ", {
            action: "MongoDB.closeConnection",
            createdAt: new Date().toISOString(),
            success: false,
            details: {
                error: error
            }
        });
        throw new Error("Error closing MongoDB connection: " + e);
    }
}
