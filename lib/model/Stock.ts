
import mongoose, { model, Model, models, Schema } from "mongoose";

export interface StockEvent extends Document {
  event: string;
  symbol: string;
  currency: string;
  exchange: string;
  mic_code: string;
  type: string;
  timestamp: number;
  price: number;
}
const stockSchema = new Schema({
  event: { type: String },
  symbol: { type: String },
  currency: { type: String },
  exchange: { type: String },
  mic_code: { type: String },
  type: { type: String },
  timestamp: { type: Number },
  price: { type: Number },
});

let Stock: Model<StockEvent>;

try {
  Stock = mongoose.model<StockEvent>('Stock');
} catch (e) {
  Stock = mongoose.model<StockEvent>('Stock', stockSchema);
}

export default Stock;