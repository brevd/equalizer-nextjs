import { getBillMateByUserId } from "@/lib/api/billMates/queries";

export default async function Account() {
  const { billMate } = await getBillMateByUserId();
  if (!billMate)
    return <>Oopsie, we cannot find your bill mate, please contact support.</>;
  return (
    <main>
      <h1 className="text-2xl font-semibold my-4">Account</h1>
      <p>Primary User Bill Mate</p>
      <pre>{JSON.stringify(billMate, null, " ")}</pre>
    </main>
  );
}
