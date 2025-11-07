import mongoose, { Schema, Model } from 'mongoose';

export interface IAddress {
  province: string;
  cityOrDistrict: string;
  streetInfo: string;
  landmark?: string;
}

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  phonePrimary: string;
  phoneSecondary?: string;
  role: 'user' | 'admin';
  address?: IAddress;
  createdAt: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    province: { type: String, required: true },
    cityOrDistrict: { type: String, required: true },
    streetInfo: { type: String, required: true },
    landmark: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    phonePrimary: { type: String, required: true },
    phoneSecondary: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: AddressSchema,
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

let User: Model<IUser>;
if (mongoose.models.User) {
  const existingModel = mongoose.models.User;
  const schemaPaths = Object.keys(existingModel.schema.paths);
  if (schemaPaths.includes('firstName') || schemaPaths.includes('lastName')) {
    delete mongoose.models.User;
    User = mongoose.model<IUser>('User', UserSchema);
  } else {
    User = existingModel;
  }
} else {
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;

