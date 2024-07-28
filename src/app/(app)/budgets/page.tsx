import BudgetForm from "@/components/budgets/BudgetForm";
import {
  BudgetSplit,
  ChartDataItem,
  MonthOverMonth,
  Totals,
} from "./monthToMonthComparisonChart";
import { getCategories } from "@/lib/api/categories/queries";
import { getBudgets } from "@/lib/api/budgets/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetProgress from "./budgetProgress";
import { getSplitsByBillMateOverTimePeriod } from "@/lib/api/splits/queries";
import { getBillMateByUserId } from "@/lib/api/billMates/queries";
import { getUserAuth } from "@/lib/auth/utils";
import { Category } from "@/lib/db/schema/categories";

export default async function Budgets() {
  const { categories } = await getCategories();
  const { budgets } = await getBudgets();

  const usedCategoryIds = budgets.map((b) => b.categoryId);
  const remainingCategories = categories.filter(
    (category) => !usedCategoryIds.includes(category.id)
  );
  return (
    <>
      <div className="flex gap-2 mb-2">
        {/* create new budget from an existing category if category not used yet */}
        {remainingCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetForm categories={remainingCategories} />
            </CardContent>
          </Card>
        )}
        {/* show budgets created by this user and edit */}
        <Card className="min-w-fit">
          <CardHeader>
            <CardTitle>Current Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.map((b) => (
              <BudgetProgress
                key={b.id}
                title={b.category?.title || "unknown"}
                current={25}
                budget={b.amount}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* show this month compared to last month budget use */}
      <SpendingComparison categories={categories} />
    </>
  );
}

const SpendingComparison = async ({
  categories,
}: {
  categories: Category[];
}) => {
  // pull all splits for this bill mate over past two months
  // compare spending in each category vs same category last month
  const { billMate } = await getBillMateByUserId();
  if (!billMate) return <>no bill mate record found for you...</>;
  const { splits } = await getSplitsByBillMateOverTimePeriod(billMate.id, 2);

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.title])
  );
  const groupedSplits = groupAndSumSplitsByCategory(splits, categoryMap);
  const chartData = formatChartData(groupedSplits);
  return <MonthOverMonth data={chartData} />;
};

function groupAndSumSplitsByCategory(
  splits: BudgetSplit[],
  categoryMap: Map<string, string>
): Map<string, Totals> {
  const currentDate = new Date();
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const previousMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const totalsMap: Map<string, Totals> = new Map();

  splits.forEach((split) => {
    const expenseDate = new Date(split.createdAt);
    const category = split.expenseCategory || "Uncategorized";
    const categoryTitle = categoryMap.get(category) || "Uncategorized";

    if (!totalsMap.has(categoryTitle)) {
      totalsMap.set(categoryTitle, { currentMonth: 0, previousMonth: 0 });
    }

    const totals = totalsMap.get(categoryTitle);

    if (totals) {
      if (expenseDate >= currentMonthStart) {
        totals.currentMonth += split.responsible;
      } else if (expenseDate >= previousMonthStart) {
        totals.previousMonth += split.responsible;
      }
    }
  });

  return totalsMap;
}

function formatChartData(totalsMap: Map<string, Totals>): ChartDataItem[] {
  const chartData: ChartDataItem[] = [];

  totalsMap.forEach((totals, category) => {
    chartData.push({
      category,
      currentMonth: totals.currentMonth,
      previousMonth: totals.previousMonth,
    });
  });
  return chartData;
}
