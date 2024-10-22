// receiver.js
const { connectRabbitMQ } = require("./rabbit");
const prompt = require('prompt-sync')();

(async () => {
  const { channel: receiveChannel } = await connectRabbitMQ();
  const queueToReceiveMessage = "sender1";
  const queueToSendMessage = "sender2";

  // Função para consumir uma mensagem
  const consumeMessage = async () => {
    return new Promise((resolve) => {
      receiveChannel.consume(
        queueToReceiveMessage,
        (message) => {
          if (message) {
            const receivedMsg = JSON.parse(message.content.toString());
            console.log(" [x] Mensagem recebida: '%s'", receivedMsg);
            resolve(receivedMsg); // Resolver a promessa com a mensagem recebida
          }
        },
        { noAck: true }
      );
    });
  };

  const { channel: sendChannel } = await connectRabbitMQ();

  while (true) {
    await consumeMessage();

    const response = await prompt('Digite sua mensagem: ');

    // Enviar a resposta para a fila
    sendChannel.sendToQueue(queueToSendMessage, Buffer.from(JSON.stringify(response)));
    console.log("Resposta enviada:", response);
  }
})();
