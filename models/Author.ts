import mongoose, { Schema, Model } from "mongoose";

export interface IAuthor {
  name: string;
  bio?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Author: Model<IAuthor> =
  mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);

export default Author;


