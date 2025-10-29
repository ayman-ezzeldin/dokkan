import mongoose, { Schema, Model } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

