import { model, Schema, Document } from 'mongoose';
import { Jwt } from '@interfaces/jwt.interface';
const jwtSchema: Schema = new Schema({
  jwt: {type: String},
});

const jwtModel = model<Jwt & Document>('jwt', jwtSchema);

export default jwtModel;
