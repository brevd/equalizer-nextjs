import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/lib/api/expenses/mutations";
import { 
  expenseIdSchema,
  insertExpenseParams,
  updateExpenseParams 
} from "@/lib/db/schema/expenses";

export async function POST(req: Request) {
  try {
    const validatedData = insertExpenseParams.parse(await req.json());
    const { expense } = await createExpense(validatedData);

    revalidatePath("/expenses"); // optional - assumes you will have named route same as entity

    return NextResponse.json(expense, { status: 201 });
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

    const validatedData = updateExpenseParams.parse(await req.json());
    const validatedParams = expenseIdSchema.parse({ id });

    const { expense } = await updateExpense(validatedParams.id, validatedData);

    return NextResponse.json(expense, { status: 200 });
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

    const validatedParams = expenseIdSchema.parse({ id });
    const { expense } = await deleteExpense(validatedParams.id);

    return NextResponse.json(expense, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
