import { IsString, IsDate } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateVoterDto {
  @IsString()
  public name: string;
  @IsString()
  public surname: string;
  @IsString()
  public number: string;
  @IsString()
  public vote_location: string;
  @IsDate()
  public vote_datetime: Date;
  @IsString()
  public vote_signer: ObjectId;
  @IsString()
  public fiscal_code: string;
}

export class CreateVoterSearchDto {
  @IsString()
  public surname: string;
  @IsString()
  public number: string;
}

export class CreateVoterRegistryUpdateDto {
  @IsString()
  public vote_location: string;
}