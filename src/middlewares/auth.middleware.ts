import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import jwtModel from '@/models/jwt.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {

    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const is_blacklisted = await jwtModel.findOne({jwt: Authorization}).collation({'locale':'it', 'strength': 1})
      console.log("Is blacklisted:", is_blacklisted)
      if (is_blacklisted) {
        next(new HttpException(403, 'Blacklisted authentication token'));
      }
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);
      console.debug("Find user:", findUser)
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(403, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
