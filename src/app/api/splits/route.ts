import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSplit,
  deleteSplit,
  updateSplit,
} from "@/lib/api/splits/mutations";
import { 
  splitIdSchema,
  insertSplitParams,
  updateSplitParams 
} from "@/lib/db/schema/splits";

export async function POST(req: Request) {
  try {
    const validatedData = insertSplitParams.parse(await req.json());
    const { split } = await createSplit(validatedData);

    revalidatePath("/splits"); // optional - assumes you will have named route same as entity

    return NextResponse.json(split, { status: 201 });
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

    const validatedData = updateSplitParams.parse(await req.json());
    const validatedParams = splitIdSchema.parse({ id });

    const { split } = await updateSplit(validatedParams.id, validatedData);

    return NextResponse.json(split, { status: 200 });
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

    const validatedParams = splitIdSchema.parse({ id });
    const { split } = await deleteSplit(validatedParams.id);

    return NextResponse.json(split, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
