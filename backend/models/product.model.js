import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],

    unit: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: null,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: null,
      min: [0, "Stock cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: String,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
