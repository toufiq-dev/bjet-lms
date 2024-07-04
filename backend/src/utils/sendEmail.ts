import nodemailer from "nodemailer";
import amqp from "amqplib";
import config from "../config";
import { logger } from "./logger";

export async function startEmailService() {
  try {
    const connection = await amqp.connect(config.rabbitMQUrl);

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
