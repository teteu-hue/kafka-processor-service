import 'dotenv/config';

import { openConnection } from './database/mongodb';
import { Log } from './shared/logger/Log';

async function startApp() {

    try {
        await openConnection();
        Log.info("Application started successfully!", {
            action: "startApp",
            createdAt: new Date().toISOString(),
            success: true
        });

        require('./Router');

    } catch(e) {
        const error = e instanceof Error ? e.message : "Erro desconhecido!";
        Log.error("Failed to start application:", {
            action: "startApp",
            createdAt: new Date().toISOString(),
            success: false,
            details: {
                error: error
            }
        });
        process.exit(1);
    }
};

startApp();