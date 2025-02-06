const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Reference to the Product model
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;