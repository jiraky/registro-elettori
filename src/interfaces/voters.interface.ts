import { ObjectId } from "mongoose";

export interface Voter {
  _id: string;
  name: string;
  surname: string;
  number: string;
  vote_location: string;
  vote_datetime: Date;
  vote_signer: string;
  fiscal_code: string;
}
