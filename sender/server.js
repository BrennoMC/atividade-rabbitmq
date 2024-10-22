const amqp = require("amqplib");
const prompt = require('prompt-sync')();

const queueToReceiveMessage = "sender2";
const queueToSendMessage = "sender1";

(async () => {
  let connection1, connection2;
  try {

    while (true){
        // Prompt para capturar a mensagem
        let text = await prompt("Digite sua mensagem:");

        // Conectar à fila de envio
        connection1 = await amqp.connect("amqp://localhost");
        let channel1 = await connection1.createChannel();
        await channel1.assertQueue(queueToSendMessage, { durable: false });

        // Enviar a mensagem para a fila
        channel1.sendToQueue(queueToSendMessage, Buffer.from(JSON.stringify(text)));
        console.log("Mensagem enviada:", text);

        // Conectar à fila de recebimento
        connection2 = await amqp.connect("amqp://localhost");
        let channel2 = await connection2.createChannel();
        await channel2.assertQueue(queueToReceiveMessage, { durable: false });

        // Consumir mensagens da fila de recebimento
        await channel2.consume(
        queueToReceiveMessage,
        (message) => {
            if (message) {
            console.log(
                " [x] Mensagem recebida: '%s'",
                JSON.parse(message.content.toString())
            );
            }
        },
        { noAck: true }
        );

        // Aguardar até que o processo seja interrompido manualmente
        process.once("SIGINT", async () => {
        await channel1.close();
        await channel2.close();
        await connection1.close();
        await connection2.close();
        console.log("Conexões fechadas");
        process.exit(0);
        });

    }
    
  } catch (err) {
    console.warn("Erro:", err);
  }
})();
