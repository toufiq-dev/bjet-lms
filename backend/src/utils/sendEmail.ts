import nodemailer from "nodemailer";
import amqp from "amqplib";
import config from "../config";
import { logger } from "./logger";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

async function connectWithRetry(retries = MAX_RETRIES) {
  try {
    const connection = await amqp.connect(config.rabbitMQUrl);

    return connection;
  } catch (error) {
    if (retries === 0) {
      logger.error("Max retries reached. Unable to connect to RabbitMQ");
      throw error;
    }
    logger.warn(
      `Failed to connect to RabbitMQ. Retrying in ${
        RETRY_INTERVAL / 1000
      } seconds...`
    );
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    return connectWithRetry(retries - 1);
  }
}

export async function startEmailService() {
  try {
    const connection = await connectWithRetry();
    const channel = await connection.createChannel();
    await channel.assertQueue("emailQueue", { durable: true });

    const transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    } as nodemailer.TransportOptions);

    channel.consume("emailQueue", async (msg) => {
      if (msg !== null) {
        const emailMessage = JSON.parse(msg.content.toString());
        try {
          await transporter.sendMail({
            ...emailMessage,
            from: '"BJET LMS" <from@mailtrap.io>',
          });
          channel.ack(msg);
        } catch (error) {
          console.error("Failed to send email", error);
        }
      }
    });
  } catch (error) {
    logger.error("Failed to start email service", error);
    throw error;
  }
}

startEmailService().catch(console.error);
