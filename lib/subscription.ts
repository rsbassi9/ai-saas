import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  // if there is no userId, we dont know if they are subscribed or not, so we assume they are not
  if (!userId) {
    return false;
  }

  // if they have a userId:
  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // if we get the userId but there is no subscription:
  if (!userSubscription) {
    return false;
  }

  // If there is a subscription and it is not expired (giving one day grace period, DAY_IN_MS):
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
