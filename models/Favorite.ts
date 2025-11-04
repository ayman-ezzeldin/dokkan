import mongoose, { Schema, Model } from 'mongoose';

export interface IFavorite {
  userId: mongoose.Types.ObjectId;
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1 });

const Favorite: Model<IFavorite> = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;

