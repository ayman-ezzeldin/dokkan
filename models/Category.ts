import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  parentId?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

CategorySchema.index({ slug: 1 }, { unique: true });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

