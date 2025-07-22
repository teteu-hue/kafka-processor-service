import { Response, Request } from "express";
import { Message } from "kafkajs";
import orderService from "../services/OrderService";
import { Log } from "../../../shared/logger/Log";
import { LogMeta } from "@src/shared/logger/LogMeta";

async function index(req: Request, res: Response) {
  const topicName: string | null = req.body.topicName;
  const messages: Message[] = req.body.messages;

  if (!topicName) {
    const metaLog: LogMeta =  {
      action: "OrderController.index", 
      success: false, 
      createdAt: new Date().toISOString(),
      details: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    };
    Log.error("Topic name is not informed in request!", metaLog);
    return res
      .status(422)
      .json({
        message: "Please check the body of request! Check our documentation.",
      })
      .end();
  }

  if (messages.length <= 0) {
    const metaLog: LogMeta =  {
      action: "OrderController.index", 
      success: false, 
      createdAt: new Date().toISOString(),
      details: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    };
    Log.error("Messages are not informed in request!", metaLog);
    return res.status(204).end();
  }
  try {
    const metaLog: LogMeta =  {
      action: "OrderController.index", 
      createdAt: new Date().toISOString(),
      details: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    }
    Log.info("Processing orders from topic: " + topicName, metaLog);
    
    orderService.produceOrders(topicName, messages).then((success) => {
      metaLog.success = true;

      Log.info(`Messages were sent successfully!`, metaLog);
    });

    return res
      .status(200)
      .json({
        success: true,
        message: `Messages sent to topic ${topicName} with success!`,
      })
      .end();

  } catch (error) {
    const metaLog: LogMeta =  {
      action: "OrderController.index", 
      createdAt: new Date().toISOString(),
      success: false,
      details: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        error: error instanceof Error ? error.message : "Unknown error"
      }
    };
    Log.error("Error while processing orders!", metaLog);
    return res
      .status(500)
      .json({
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      })
      .end();
  }
}

export default { index };