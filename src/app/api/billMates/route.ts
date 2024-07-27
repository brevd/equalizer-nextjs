import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createBillMate,
  deleteBillMate,
  updateBillMate,
} from "@/lib/api/billMates/mutations";
import { 
  billMateIdSchema,
  insertBillMateParams,
  updateBillMateParams 
} from "@/lib/db/schema/billMates";

export async function POST(req: Request) {
  try {
    const validatedData = insertBillMateParams.parse(await req.json());
    const { billMate } = await createBillMate(validatedData);

    revalidatePath("/billMates"); // optional - assumes you will have named route same as entity

    return NextResponse.json(billMate, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateBillMateParams.parse(await req.json());
    const validatedParams = billMateIdSchema.parse({ id });

    const { billMate } = await updateBillMate(validatedParams.id, validatedData);

    return NextResponse.json(billMate, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = billMateIdSchema.parse({ id });
    const { billMate } = await deleteBillMate(validatedParams.id);

    return NextResponse.json(billMate, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
