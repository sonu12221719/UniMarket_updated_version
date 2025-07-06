import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    age: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ["Electronics", "Books", "Furniture", "Clothing", "Other"], // customize
      default: "Other"
    },
    images: [
      {
        public_id: String,
        url: String
      }
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available"
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
