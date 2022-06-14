import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const tokenData = await this.authService.login(userData);

      //res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    
      if(await this.authService.logout(Authorization)) {
        res.status(200).json({ message: 'logout' });
      }      
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
