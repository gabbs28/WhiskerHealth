import { NextFunction, Response } from "express";
import { AuthReq } from "../typings/express";
import { AuthError } from "../errors/customErrors";
import { SafeUserType} from "../database/selects/users";
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';
import { prisma } from "../database/client";
import { stringify } from "../app";

const { secret, expiresIn } = jwtConfig;


interface ISafeUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export const setMobileToken = (res:Response, user:any) => {
  const safeUser:ISafeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username
  };


  const token = jwt.sign(
    {data: JSON.parse(stringify(safeUser))},
    secret,
    {expiresIn: expiresIn}
  );

  res.header({
    token
  })
  return token;
}
export const createSafeUser = (user:SafeUserType) => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username
  };
}
// Sends a JWT Cookie
// Accept any objects in the shape of a safe user 
export const setTokenCookie = (res:Response, user:SafeUserType) => {
  // Create the token.
  const safeUser = createSafeUser(user);


  const token = jwt.sign(
    {data: JSON.parse(stringify(safeUser))},
    secret,
    { expiresIn: expiresIn } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "lax"
  });
  return token;
};

export const restoreUser = (req:any, res:any, next:NextFunction) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token as string, secret,  async (err, jwtPayload) => {
    if (err) {
      next();
      return;
    }

    try {
      if (jwtPayload === undefined || typeof jwtPayload === "string") {
          throw new Error("invalid data")
;      }
      const { id } = jwtPayload.data;
      req.user = await prisma.users.findUnique({
        where: {
          id : id
        }
      })

    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
export const requireAuth = function (req:AuthReq, _res:Response, next:NextFunction) {
  if (req.user) return next();

  const err = new AuthError('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}
