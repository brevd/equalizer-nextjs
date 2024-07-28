import { Progress } from "@/components/ui/progress";

export default function BudgetProgress({
  title,
  current,
  budget,
}: {
  title: string;
  current: number;
  budget: number;
}) {
  return (
    <div className="min-w-96">
      <div className="flex gap-3">
        <h4>{title}:</h4>
        <p>{`${current} / ${budget}`}</p>
      </div>
      <Progress value={(current * 100.0) / budget} />
    </div>
  );
}
