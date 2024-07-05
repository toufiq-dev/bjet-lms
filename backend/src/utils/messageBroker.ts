import amqp from "amqplib";
import config from "../config";

class RabbitMQClient {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    this.connection = await amqp.connect(config.rabbitMQUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue("emailQueue", { durable: true });
  }

  async publish(queue: string, message: any) {
    if (!this.channel) throw new Error("RabbitMQ channel is not created");
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

export const rabbitMQClient = new RabbitMQClient();
