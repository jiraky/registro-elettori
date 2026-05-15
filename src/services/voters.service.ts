import { hash } from 'bcrypt';
import { CreateVoterDto, CreateVoterRegistryUpdateDto } from '@dtos/voters.dto';
import { HttpException } from '@exceptions/HttpException';
import { Voter } from '@interfaces/voters.interface';
import voterModel from '@models/voters.model';
import { isEmpty } from '@utils/util';
import { User } from '@/interfaces/users.interface';

class VoterService {
  public voters = voterModel;

  public async findAllVoter(): Promise<Voter[]> {
    const voters: Voter[] = await this.voters.find();
    return voters;
  }

  public async findVoterById(voterId: string): Promise<Voter> {
    const notEmptyVoterId = (voterId ?? "").trim();
    if (isEmpty(notEmptyVoterId)) throw new HttpException(400, "Empty");

    const findVoter: Voter = await this.voters.findOne({ _id: notEmptyVoterId });
    if (!findVoter) throw new HttpException(409, "Not found");

    return findVoter;
  }

  public async hasVoted(voterId: string): Promise<Boolean> {
    const notEmptyVoterId = (voterId ?? "").trim();
    if (isEmpty(notEmptyVoterId)) throw new HttpException(400, "Empty");

    const findVoter: Voter = await this.findVoterById(notEmptyVoterId);
    if (!findVoter) throw new HttpException(409, "Not found");
    return findVoter.vote_datetime != null;
  }

  public async findVoterBySurnameAndRegistryCode(voterSurname: string, voterRegistryCode: string): Promise<Voter> {

    const notEmptyVoterSurname = (voterSurname ?? "").trim();
    const notEmptyVoterRegistryCode = (voterRegistryCode ?? "").trim();

    if (isEmpty(notEmptyVoterSurname)) throw new HttpException(400, "Empty surname");
    if (isEmpty(notEmptyVoterRegistryCode)) throw new HttpException(400, "Empty registry code");
    
    const findVoter: Voter = await this.voters.findOne({ surname: notEmptyVoterSurname, number: notEmptyVoterRegistryCode }).collation({'locale':'it','strength':1});
    if (!findVoter) throw new HttpException(404, "Voter not found");

    return findVoter;
  }

  public async findVoterByFiscalCode(voterFC: string): Promise<Voter> {

    const notEmptyVoterFC = (voterFC ?? "").trim();

    if (isEmpty(notEmptyVoterFC)) throw new HttpException(400, "Empty");

    const findVoter: Voter = await this.voters.findOne({ fiscal_code: notEmptyVoterFC });
    if (!findVoter) throw new HttpException(409, "Not found");

    return findVoter;
  }

  public async updateVoter(voterId: string, voterData: CreateVoterRegistryUpdateDto, user: User): Promise<void> {
    if (isEmpty(voterData)) throw new HttpException(400, "Empty");
    const updateVoterById: Voter = await this.voters.findByIdAndUpdate(voterId, { ...voterData, vote_datetime: new Date(), vote_signer: user._id });
    if (!updateVoterById) throw new HttpException(400, "Not found");
    return;
/*
    if (voterData.email) {
      const findVoter: Voter = await this.voters.findOne({ email: voterData.email });
      if (findVoter && findVoter._id != voterId) throw new HttpException(409, `You're email ${voterData.email} already exists`);
    }

    if (voterData.password) {
      const hashedPassword = await hash(voterData.password, 10);
      voterData = { ...voterData, password: hashedPassword };
    }

    const updateVoterById: Voter = await this.voters.findByIdAndUpdate(voterId, { voterData });
    if (!updateVoterById) throw new HttpException(409, "You're not voter");

    return updateVoterById;*/
    //return null;
  }
}

export default VoterService;
