import { User } from "../models/user.model.js";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      role: { $in: ["admin"] },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: ["admin"],
      authProvider: "local",
      isEmailVerified: true,
      isApproved: true,
      isActive: true,
    });

    console.log("🔥 Admin created:", admin.email);
  } catch (error) {
    console.error("❌ Admin seed error:", error.message);
  }
};
