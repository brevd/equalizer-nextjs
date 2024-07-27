import { Button } from "@/components/ui/button";
import { getBillGroupsByUserId } from "@/lib/api/billGroups/queries";
import { getUserAuth } from "@/lib/auth/utils";
import Link from "next/link";

export default async function Home() {
  const userAuth = await getUserAuth();
  const x = await getBillGroupsByUserId();
  return (
    <main className="space-y-6">
      <Link href="/bill-groups">
        <Button variant="outline">Bill Groups</Button>
      </Link>
      <pre className="bg-secondary p-4 rounded-sm shadow-sm text-secondary-foreground break-all whitespace-break-spaces">
        {JSON.stringify(x, null, 2)}
      </pre>
    </main>
  );
}
