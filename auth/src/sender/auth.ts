/** @format */

import amqp from "amqplib";
const sendEmailToQueue = async (
    exchacnge: string,
    queue: string,
    data: {
        from: string;
        to: string;
        subject: string;
        text: string;
        source: string;
    }
) => {
    try {
        const connection = await amqp.connect(
            "amqp://guest:guest@172.17.0.1:5672"
        );
        const channel = await connection.createChannel();

        const exchange = exchacnge;
        const routingKey = queue;

        // Assert both the exchange and queue exist on the broker
        await channel.assertQueue(queue, { durable: true });
        await channel.assertExchange(exchange, "direct", { durable: true });

        //bind the queue to the exchange with the routing key
        await channel.bindQueue(queue, exchange, routingKey);

        // stingify the data
        const stringifiedData = JSON.stringify(data);

        channel.publish(exchange, queue, Buffer.from(stringifiedData));
        console.log(`Sent ${data} to ${queue}`);

        setTimeout(() => {
            connection.close();
        }, 500);

        return true;
    } catch (error) {
        console.log("error occured during email sent to queue: ", error);
        return error;
    }
};
export default sendEmailToQueue;
