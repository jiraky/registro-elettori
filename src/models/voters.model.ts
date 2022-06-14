import { model, Schema, Document } from 'mongoose';
import { Voter } from '@interfaces/voters.interface';
const votersSchema: Schema = new Schema({
  name: {type: String,required: true},
  surname: {type: String,required: true},
  number: {type: String,required: true},
  vote_location: {type: String,required: false},
  vote_datetime: {type: Date,required: false},
  vote_signer: {type: require('mongoose').Schema.Types.ObjectId,required: false},
  fiscal_code: {type: String,required: true},
});

const votersModel = model<Voter & Document>('voters', votersSchema);

export default votersModel;
