import { CreatePreferencePayload } from "mercadopago/models/preferences/create-payload.model";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import mercadopago from "mercadopago";

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

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, orderFormData } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

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

  const preference: CreatePreferencePayload = {
    items,
    auto_return: "approved",
    back_urls: {
      success: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      failure: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    },
    notification_url: 'https://ecommerce-admin-ginopastran.vercel.app/api/bc381951-9fce-4f31-b7d3-fadfca3e2f16/checkout/webhook',
    external_reference: order.id,
  };

  const response = await mercadopago.preferences.create(preference);

  return NextResponse.json({ url: response.body.init_point }, {
    headers: corsHeaders
  });
};

