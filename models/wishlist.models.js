const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", 
                required: true,
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

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;