import { NextFunction, Request, Response } from 'express';
import { CreateVoterDto, CreateVoterRegistryUpdateDto, CreateVoterSearchDto } from '@dtos/voters.dto';
import { Voter } from '@interfaces/voters.interface';
import voterService from '@services/voters.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import UserService from '@/services/users.service';
import { logger } from '@utils/logger';
import { HttpException } from '@/exceptions/HttpException';

class VotersController {
  public voterService = new voterService();

  public getVoters = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      if (userData.email != "segreteria@ingegneri.vr.it") {
        next(new HttpException(401, 'Not authorized'));
      }
      const findAllVotersData: Voter[] = await this.voterService.findAllVoter();
      res.status(200).json(findAllVotersData);
    } catch (error) {
      next(error);
    }
  };

  public getVoterById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      if (userData.email != "segreteria@ingegneri.vr.it") {
        next(new HttpException(401, 'Not authorized'));
      }
      const voterId: string = req.params.id;
      const findOneVoterData: Voter = await this.voterService.findVoterById(voterId);

      res.status(200).json(findOneVoterData);
    } catch (error) {
      next(error);
    }
  };

  public findVoterBySurnameAndRegistryCode = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const voterData: CreateVoterSearchDto = req.body;
      const findOneVoterData: Voter = await this.voterService.findVoterBySurnameAndRegistryCode(voterData.surname, voterData.number)
    
      if(typeof findOneVoterData.vote_datetime !== 'undefined' && findOneVoterData.vote_datetime !== null) {
        logger.info("[VOTER] Request voter data by " + userData._id + "\tVoter "+ findOneVoterData + " has already voted.")
      } else {
        logger.info("[VOTER] Request voter data by " + userData._id + "\tVoter "+ findOneVoterData + " has not voted yet.")
      }

      res.status(200).json(findOneVoterData);
    } catch (error) {
      next(error);
    }
  }

  public hasVoted = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const voterId: string = req.params.id;
      const hasVoted: Boolean = await this.voterService.hasVoted(voterId);
      if (hasVoted) {
        const findOneVoterData: Voter = await this.voterService.findVoterById(voterId);
        return res.status(200).json({
          "has_voted": true,
          "where": findOneVoterData.vote_location,
          "when": findOneVoterData.vote_datetime,
          "signed": (await new UserService().findUserById(findOneVoterData.vote_signer)).email
        });
      } else {
        res.status(200).json({
          "has_voted": false
        });
      }
      
    } catch (error) {
      next(error);
    }
  };

  public updateVoter = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const voterId: string = req.params.id;
      const voterData: CreateVoterRegistryUpdateDto = req.body;

      if ((await this.voterService.hasVoted(voterId))) {
        logger.info("[VOTER] Unauthorized voter update request by " + userData._id + "\tVoter "+ voterId)
        res.status(403).json({ data: {user: req.user.email, request_update_for: voterId}, message: 'Unauthorized update. Request has been logged.' });
      } else {
        await this.voterService.updateVoter(voterId, voterData, userData);
        logger.info("[VOTER] Authorized voter update request by " + userData._id + "\tVoter "+ voterId + "\tLocation " + voterData.vote_location)
        res.status(200).json({ message: 'updated' });
      }

    } catch (error) {
      next(error);
    }
  };
}

export default VotersController;
