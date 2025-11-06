import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  title: string;
  slug: string;
  description: string;
  author?: mongoose.Types.ObjectId;
  image?: string;
  images: string[];
  price: number;
  currency: string;
  categoryId?: mongoose.Types.ObjectId;
  tags: string[];
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  image: { type: String },
  images: { type: [String], default: [] },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ title: 'text', tags: 'text' });
ProductSchema.index({ categoryId: 1, price: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

