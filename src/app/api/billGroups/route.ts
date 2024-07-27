import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createBillGroup,
  deleteBillGroup,
  updateBillGroup,
} from "@/lib/api/billGroups/mutations";
import { 
  billGroupIdSchema,
  insertBillGroupParams,
  updateBillGroupParams 
} from "@/lib/db/schema/billGroups";

export async function POST(req: Request) {
  try {
    const validatedData = insertBillGroupParams.parse(await req.json());
    const { billGroup } = await createBillGroup(validatedData);

    revalidatePath("/billGroups"); // optional - assumes you will have named route same as entity

    return NextResponse.json(billGroup, { status: 201 });
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

    const validatedData = updateBillGroupParams.parse(await req.json());
    const validatedParams = billGroupIdSchema.parse({ id });

    const { billGroup } = await updateBillGroup(validatedParams.id, validatedData);

    return NextResponse.json(billGroup, { status: 200 });
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

    const validatedParams = billGroupIdSchema.parse({ id });
    const { billGroup } = await deleteBillGroup(validatedParams.id);

    return NextResponse.json(billGroup, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
