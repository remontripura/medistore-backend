import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  app_user: process.env.APP_USER,
  app_password: process.env.APP_PASS,
  port: process.env.PORT,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL,
  database_url: process.env.DATABASE_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_role: process.env.ADMIN_ROLE,
  admin_password: process.env.ADMIN_PASSWORD,
};
export default config;
