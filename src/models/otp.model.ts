import { model, Schema, Document } from 'mongoose';
import { Otp } from '@interfaces/otps.interface';

const otpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  }, 
  password: {
    type: String,
    required: true,
  },  
});

const otpModel = model<Otp & Document>('Otp', otpSchema);

export default otpModel;
