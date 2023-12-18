import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const paymentId = await req.text();

  let payment;
  try {
    payment = await mercadopago.payment.findById(paymentId);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (payment.status === "approved") {
    const order = await prismadb.order.update({
      where: {
        id: payment.order.id,
      },
      data: {
        isPaid: true,
        // MercadoPago no proporciona detalles de la dirección del cliente en el objeto de pago
        // Deberías obtener estos detalles de otra manera
        address: '',
        phone: '',
      },
      include: {
        orderItems: true,
      }
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });
  }

  return new NextResponse(null, { status: 200 });
};