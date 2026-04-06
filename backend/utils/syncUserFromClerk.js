import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const buildName = (firstName, lastName, fallback) => {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  return fullName || fallback || "User";
};

export const syncUserFromClerk = async (userId) => {
  if (!userId) {
    throw new Error("Missing userId while syncing user");
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const primaryEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("User email not found in Clerk profile");
  }

  const userData = {
    _id: userId,
    name: buildName(clerkUser?.firstName, clerkUser?.lastName, clerkUser?.username),
    email: primaryEmail,
    image: clerkUser?.imageUrl || "",
  };

  return User.findByIdAndUpdate(userId, userData, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};
