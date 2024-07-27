"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await completeOnboarding(formData);
    await user?.reload();
    router.push("/dashboard");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div>
            <Label className={"mb-2 inline-block"}>Name</Label>
            <Input type="text" name="billMateName" className="w-96" />
          </div>
          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
