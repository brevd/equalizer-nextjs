import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/lib/api/budgets/mutations";
import { 
  budgetIdSchema,
  insertBudgetParams,
  updateBudgetParams 
} from "@/lib/db/schema/budgets";

export async function POST(req: Request) {
  try {
    const validatedData = insertBudgetParams.parse(await req.json());
    const { budget } = await createBudget(validatedData);

    revalidatePath("/budgets"); // optional - assumes you will have named route same as entity

    return NextResponse.json(budget, { status: 201 });
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

    const validatedData = updateBudgetParams.parse(await req.json());
    const validatedParams = budgetIdSchema.parse({ id });

    const { budget } = await updateBudget(validatedParams.id, validatedData);

    return NextResponse.json(budget, { status: 200 });
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

    const validatedParams = budgetIdSchema.parse({ id });
    const { budget } = await deleteBudget(validatedParams.id);

    return NextResponse.json(budget, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
