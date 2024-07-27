"use server";

import { createBillMateAction } from "@/lib/actions/billMates";
import { insertBillMateParams } from "@/lib/db/schema/billMates";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const userName = formData.get("billMateName");

  const billMateParsed = await insertBillMateParams.safeParseAsync({
    name: userName,
    userId: userId,
  });

  if (!billMateParsed.success) {
    console.error(billMateParsed?.error.flatten().fieldErrors);
    return;
  }

  try {
    await createBillMateAction(billMateParsed.data);
    const res = await clerkClient().users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return {
      error: "There was an error creating bill mate or updating user details.",
    };
  }
};
