"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type BudgetSplit = {
  expenseCategory: string | null | undefined;
  id: string;
  paid: number;
  responsible: number;
  createdAt: string;
  updatedAt: string;
  billMateId: string;
  expenseId: string;
};

export type Totals = {
  currentMonth: number;
  previousMonth: number;
};

export type ChartDataItem = {
  category: string;
  currentMonth: number;
  previousMonth: number;
};

export type ChartData = ChartDataItem[];

const chartConfig = {
  currentMonth: {
    label: "Current",
    color: "hsl(var(--chart-1))",
  },
  previousMonth: {
    label: "Previous",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MonthOverMonth({ data }: { data: ChartData }) {
  const totals = data.reduce(
    (acc, item) => {
      acc.totalCurrentMonth += item.currentMonth;
      acc.totalPreviousMonth += item.previousMonth;
      return acc;
    },
    { totalCurrentMonth: 0, totalPreviousMonth: 0 }
  );
  const message =
    totals.totalCurrentMonth > totals.totalPreviousMonth
      ? `Warning: You've spent ${(
          (totals.totalCurrentMonth / totals.totalPreviousMonth - 1) *
          100
        ).toFixed(2)}% more this month ($${
          totals.totalCurrentMonth
        }) compared to last month ($${totals.totalPreviousMonth}).`
      : `Good job! You've spent less this month ($${totals.totalCurrentMonth}) compared to last month (${totals.totalPreviousMonth}).`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Spending</CardTitle>
        <CardDescription>
          Compares current month with previous month spending by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="currentMonth"
              fill={chartConfig.currentMonth.color}
              radius={4}
            />
            <Bar
              dataKey="previousMonth"
              fill={chartConfig.previousMonth.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">{message}</div>
      </CardFooter>
    </Card>
  );
}
