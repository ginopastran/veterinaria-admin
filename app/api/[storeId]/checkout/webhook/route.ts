import prismadb from "@/lib/prismadb";
import mercadopago from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

mercadopago.configure({
    access_token: process.env.NEXT_ACCESS_TOKEN!,
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        const {
            type,
            data: { id },
        } = await req.json();

        console.log(type, id);

        if (type == "payment") {
            const payment = await mercadopago.payment.findById(Number(id));
            if (payment.body.status == "approved") {
                const orderId = payment.body.external_reference;
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
    } catch (error: any) {
        return NextResponse.json({ message: "An error ocurred", error: error.message }, { headers: corsHeaders });
    }
}
