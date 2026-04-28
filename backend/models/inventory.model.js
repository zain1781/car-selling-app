const mongoose = require('mongoose');

// Helper function to validate image/docs array length
function arrayLimit(val) {
    return val.length <= 20;
}

const inventorySchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    bodyType: { type: String, required: true },
    portleading: { type: String, required: true },
    color: { type: String, required: true },
    edition: { type: String, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    currentStatus: { type: String, default:"Received to ATL" },

    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 20 images'],
    },
    docs: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 20 images'],
    },

    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },

    // Financial & logistics details
    dubaiShipping: { type: Number, default: 0 },
    dubaiClearance: { type: Number, default: 0 },
    storageFee: { type: Number, default: 0 },
    inspectionCharge: { type: Number, default: 0 },
    taxDuty: { type: Number, default: 0 },
    repairCost: { type: Number, default: 0 },
    soldAmount: { type: Number, default: 0 },
    amountReceived: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    loadingDate: { type: String },
    arrivalDate: { type: String },
    handedToCustomer: { type: String, default: 'no' },
    soldInDubai: { type: String, default: 'no' },
    inTransit: { type: String, default: "no" },
    uaeShip: { type: String, default: 'no' },
    country: { type: String, default: 0 },
    customFee: { type: Number, default: 0 },
    agentFee: { type: Number, default: 0 },
portOfLoading: { type: String, default: "DUBAI" },
locationVei: { type: String, default: "DUBAI" },
dubaiRepCost: { type: Number, default: 0 },
tax: { type: Number, default: 0 },


    // Reference to the user who added the inventory
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
