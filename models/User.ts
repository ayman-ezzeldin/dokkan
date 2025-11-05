import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  role: 'user' | 'admin';
  defaultShipping?: {
    recipientName?: string;
    province?: string;
    cityOrDistrict?: string;
    streetInfo?: string;
    landmark?: string;
    phone?: string;
    phoneAlternate?: string;
    whatsapp?: string;
    notesOrBooksList?: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  passwordSalt: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  defaultShipping: {
    recipientName: { type: String },
    province: { type: String },
    cityOrDistrict: { type: String },
    streetInfo: { type: String },
    landmark: { type: String },
    phone: { type: String },
    phoneAlternate: { type: String },
    whatsapp: { type: String },
    notesOrBooksList: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

