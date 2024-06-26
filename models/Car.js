import mongoose from 'mongoose';

const { Schema } = mongoose;

const carSchema = new Schema({
  name: String,
  history: String,
  description: String,
  specifications: {
    motor: String,
    horsepower: String,
    mph0to60: String,
    topSpeed: String
  },
  category_id: String,
  available_in_market: Boolean,
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  deleted_at: { type: String, default: null },
}, { collection: 'cars' });

const Car = mongoose.model('Car', carSchema);

export default Car;
