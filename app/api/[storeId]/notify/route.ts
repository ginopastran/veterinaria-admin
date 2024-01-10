// Import necessary modules

import mercadopago from "mercadopago";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

mercadopago.configure({
    access_token: process.env.NEXT_ACCESS_TOKEN!,
});

// Define the route function
export async function POST(req: NextRequest, res: NextResponse) {
    const query = req.nextUrl.searchParams;

    const topic = query.get('topic') || query.get('type');

    console.log({ query, topic });
    try {
        if (topic === "payment") {
            const paymentId = query.get('id') || query.get("data.id");
            let payment = await mercadopago.payment.findById(Number(paymentId));
            let paymentStatus = payment.body.status;

            console.log([payment, paymentStatus]);

            if (paymentStatus === 'approved') {
                const orderId = payment.body.order.id;
                await prismadb.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        isPaid: true
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}