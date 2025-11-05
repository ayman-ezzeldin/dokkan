import mongoose, { Schema, Model, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      slug: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

CartSchema.index({ userId: 1 }, { unique: true });

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;


