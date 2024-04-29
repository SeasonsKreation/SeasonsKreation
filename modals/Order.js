const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		orderId: { type: String },
		purchaseDate: { type: Date },
		amount: { type: Number },
		paymentStatus: {
			type: String,
			enum: ["draft", "paid", "failed"],
			default: "draft",
		},
		
	    addressinfo:{ type : String},
		razorPayId: { type: String },
		amountPaid: { type: Number },
		amountPaidOn: { type: Date },
		
	},
	{ timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);
