import { Router } from 'express';
import VotersController from '@controllers/voters.controller';
import { CreateVoterDto, CreateVoterRegistryUpdateDto } from '@dtos/voters.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class VotersRoute implements Routes {
  public path = '/voters';
  public router = Router();
  public votersController = new VotersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.get(`${this.path}`, authMiddleware, this.votersController.getVoters);
    //this.router.get(`${this.path}/:id`, authMiddleware, this.votersController.getVoterById);
    this.router.post(`${this.path}/search`, authMiddleware, this.votersController.findVoterBySurnameAndRegistryCode);
    this.router.get(`${this.path}/:id/hasVoted`, authMiddleware, this.votersController.hasVoted);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateVoterRegistryUpdateDto, 'body', true), this.votersController.updateVoter);
  }
}

export default VotersRoute;
