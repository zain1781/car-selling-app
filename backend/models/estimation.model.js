const mongoose = require("mongoose");

const estimationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    Tax: {
        type: Number,
        default: 0.05,
    },
    approved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Estimation = mongoose.model('Estimation', estimationSchema);
module.exports = Estimation;
