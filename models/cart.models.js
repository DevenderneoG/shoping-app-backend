const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1, // Ensures quantity is at least 1
                default: 1 // Sets default quantity to 1 if not specified
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;