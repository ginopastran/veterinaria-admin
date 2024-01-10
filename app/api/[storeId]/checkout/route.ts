import { CreatePreferencePayload } from "mercadopago/models/preferences/create-payload.model";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import mercadopago from "mercadopago";
import { NextResponse } from "next/server";

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


const handler = async (req: NextApiRequest, res: NextApiResponse, { params }: { params: { storeId: string } }) => {
    if (req.method === "POST") {

        const { productIds, orderFormData } = req.body();


        const URL = "https://ecommerce-admin-ginopastran.vercel.app/api/bc381951-9fce-4f31-b7d3-fadfca3e2f16";

        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        const items: CreatePreferencePayload["items"] = [];

        products.forEach((product) => {
            items.push({
                title: product.name,
                unit_price: product.offerPrice ? product.offerPrice.toNumber() : product.price.toNumber(),
                quantity: 1,
            });
        });


        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                },
                formData: orderFormData
            }
        });

        try {
            const preference: CreatePreferencePayload = {
                items,
                auto_return: "approved",
                back_urls: {
                    success: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
                    failure: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
                },
                notification_url: 'https://ecommerce-admin-ginopastran.vercel.app/api/bc381951-9fce-4f31-b7d3-fadfca3e2f16/notify',
            };

            const response = await mercadopago.preferences.create(preference);

            res.status(200).send({ url: response.body.init_point });
        } catch (error) { }
    } else {
        res.status(400).json({ message: "Method not allowed" });
    }
};

export default handler;