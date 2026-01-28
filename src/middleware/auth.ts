import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
export enum UserRole {
  USER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      console.log(session?.user)
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "you are not authrised",
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify you email",
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role!,
        emailVerified: session.user.emailVerified,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources",
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
