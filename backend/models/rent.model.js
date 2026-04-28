const mongoose =  require("mongoose");

const RentAssetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  monthly_rent: { type: Number, required: true },
  vendor: { type: String, required: true },
  start_date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  payment_method: { type: String, required: true },
  end_date: { type: Date },
  payment_status: { type: String, enum: ["Paid", "Unpaid", "Pending"], required: true }
}, { timestamps: true });

const RentAsset = mongoose.model("RentAsset", RentAssetSchema);

module.exports = RentAsset;
