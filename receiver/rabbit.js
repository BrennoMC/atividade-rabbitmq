// rabbit.js
const amqp = require("amqplib");

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (err) {
    console.error("Erro ao conectar ao RabbitMQ:", err);
    process.exit(1);
  }
};

module.exports = { connectRabbitMQ };
