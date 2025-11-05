import mongoose, { Schema, Model, Types } from 'mongoose';

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
  userId?: Types.ObjectId;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  shippingDetails: {
    recipientName: string;
    province: string;
    cityOrDistrict: string;
    streetInfo: string;
    landmark?: string;
    phone: string;
    phoneAlternate?: string;
    whatsapp?: string;
    notesOrBooksList?: string;
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
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  customer: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  shippingDetails: {
    recipientName: { type: String, required: true },
    province: { type: String, required: true },
    cityOrDistrict: { type: String, required: true },
    streetInfo: { type: String, required: true },
    landmark: { type: String },
    phone: { type: String, required: true },
    phoneAlternate: { type: String },
    whatsapp: { type: String },
    notesOrBooksList: { type: String },
  },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

