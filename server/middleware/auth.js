import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {

    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);
    console.log("user role:", user.privateMetadata.role);

    if (user.privateMetadata.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("protectAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
