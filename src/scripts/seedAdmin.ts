import config from "../config";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: config.admin_name,
      email: config.admin_email,
      role: config.admin_role,
      password: config.admin_password,
    };
    //check user exist on database or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email!,
      },
    });
    if (existingUser) {
      throw new Error("User already exists in database");
    }
    return await fetch(`${config.better_auth_url}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
  } catch (error) {
    console.log("error message", error);
  }
}

seedAdmin();

// crate adminData demo --> check existingUser --> signUpAdmin post method --> if signUpAdmin ok then update that emailVerified = true
