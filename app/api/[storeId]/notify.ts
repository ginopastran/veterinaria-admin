import { NextApiRequest, NextApiResponse } from "next";
import mercadopago from "mercadopago";
import prismadb from "@/lib/prismadb";

mercadopago.configure({
    access_token: process.env.NEXT_ACCESS_TOKEN!,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query } = req;

    const topic = query.topic || query.type;

    console.log({ query, topic });
    try {
        if (topic === "payment") {
            const paymentId = query.id || query["data.id"];
            let payment = await mercadopago.payment.findById(Number(paymentId));
            let paymentStatus = payment.body.status;

            console.log([payment, paymentStatus]);

            if (paymentStatus === 'approved') {
                const orderId = payment.body.order.id; // 
                await prismadb.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        isPaid: true
                    }
                });

                console.log(`Order with id ${orderId} has been marked as paid.`);
            }
        }
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
