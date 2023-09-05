import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  //check to see if the user exists.
  //update count by one everytime a response is generated.
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
    // if user does not exist, create one and then set count to 1
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

// util to check if a user has reached the limit of free useage
export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  // if the user never generated anything, or if they have not reached their limit
  // they can still use the app - or they cant if limit reached
  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};
