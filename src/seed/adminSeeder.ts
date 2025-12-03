import User from '../models/User';

export const createAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });

  if (!existingAdmin) {
    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin"
    });

    console.log("✅ Admin created successfully");
  } else {
    console.log("⚠️ Admin already exists");
  }
};
