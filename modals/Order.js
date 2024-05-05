const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		orderId: { type: String },
		productName: { type: String,default: "Gold 18k beauty", },
		customerName: { type: String,default: "Mustkeem", },
		phone: { type: String,default: "67865897", },
		email: { type: String,default: "Mustkeem", },
		address: { type: String,default: "qwerty", },
		pincode: { type: String,default: "302016", },
		city: { type: String,default: "jaipur", },
		state: { type: String,default: "Rajsthan", },
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
