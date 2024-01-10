import mercadopago from "mercadopago";
import prismadb from "@/lib/prismadb";

mercadopago.configure({
    access_token: process.env.NEXT_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.search);

        const type = searchParams.get('type');
        const data = searchParams.get('data.id');

        if (type === 'payment' && data) {
            const paymentId = data;
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
    }
}