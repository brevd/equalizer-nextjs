import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createBillMatesToGroup,
  deleteBillMatesToGroup,
  updateBillMatesToGroup,
} from "@/lib/api/billMatesToGroups/mutations";
import { 
  billMatesToGroupIdSchema,
  insertBillMatesToGroupParams,
  updateBillMatesToGroupParams 
} from "@/lib/db/schema/billMatesToGroups";

export async function POST(req: Request) {
  try {
    const validatedData = insertBillMatesToGroupParams.parse(await req.json());
    const { billMatesToGroup } = await createBillMatesToGroup(validatedData);

    revalidatePath("/billMatesToGroups"); // optional - assumes you will have named route same as entity

    return NextResponse.json(billMatesToGroup, { status: 201 });
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

    const validatedData = updateBillMatesToGroupParams.parse(await req.json());
    const validatedParams = billMatesToGroupIdSchema.parse({ id });

    const { billMatesToGroup } = await updateBillMatesToGroup(validatedParams.id, validatedData);

    return NextResponse.json(billMatesToGroup, { status: 200 });
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

    const validatedParams = billMatesToGroupIdSchema.parse({ id });
    const { billMatesToGroup } = await deleteBillMatesToGroup(validatedParams.id);

    return NextResponse.json(billMatesToGroup, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
