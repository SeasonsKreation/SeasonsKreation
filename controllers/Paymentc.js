const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../modals/Order.js");
const { use } = require("../router/routerapi.js");
require("dotenv").config();

exports.ordercreate = async (req, res) => {
	try {
		console.log("rz KEY", process.env.RAZORPAY_API_SECRET);

		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_API_KEY,
			key_secret: process.env.RAZORPAY_API_SECRET,
		});

		const options = {
			amount: req.body.amount,
			 // use rupee * 100 (if the amount is 10 rupees put 1000).
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		let newOrder = new Order({
			amount: req.body.amount /100,
			purchaseDate: new Date(),
			orderId: crypto.randomBytes(10).toString("hex"),
			paymentStatus: "draft",
			productDetails: req.body.productDetails,
			addressinfo:req.body.checkoutInput,
		});

		await newOrder.save();

		instance.orders.create(options, (error, order) => {
			
			if (error) {
				console.log("rz failed:",error);
				return res.status(500).json({
					message:
						"Something went wrong while creating razorpay order.",
						data:
						error,
				});
			}

			console.log("rz order:",order)

			return res.status(200).json({
				data: order,
				payment: instance,
				success: true,
				message: "success",
				orderId: newOrder._id,
			});

		});


		try {

			const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
				email: 'shiprocketweb@gmail.com',
				password: 'Mohtashim@15'
			  })
			});
		
			if (!response.ok) {
			  	return res.status(500).json({
					message:
						"Something went wrong while creating Shiprocket order.",
				});
			}
		
			const data_ap = await response.json();

			var data_body = JSON.stringify({
				"order_id": "224-447",
				"order_date": "2019-07-24 11:11",
				"pickup_location": "Jammu",
				"channel_id": 1234,
				"comment": "Reseller: M/s Goku",
				"billing_customer_name": "Naruto",
				"billing_last_name": "Uzumaki",
				"billing_address": "House 221B, Leaf Village",
				"billing_address_2": "Near Hokage House",
				"billing_city": "New Delhi",
				"billing_pincode": "110002",
				"billing_state": "Delhi",
				"billing_country": "India",
				"billing_email": "naruto@uzumaki.com",
				"billing_phone": "9876543210",
				"shipping_is_billing": true,
				"shipping_customer_name": "",
				"shipping_last_name": "",
				"shipping_address": "",
				"shipping_address_2": "",
				"shipping_city": "",
				"shipping_pincode": "",
				"shipping_country": "",
				"shipping_state": "",
				"shipping_email": "",
				"shipping_phone": "",
				"order_items": [
					{
					"name": "Kunai",
					"sku": "chakra123",
					"units": 10,
					"selling_price": "900",
					"discount": "",
					"tax": "",
					"hsn": 441122
					}
				],
				"payment_method": "Prepaid",
				"shipping_charges": 0,
				"giftwrap_charges": 0,
				"transaction_charges": 0,
				"total_discount": 0,
				"sub_total": 9000,
				"length": 10,
				"breadth": 15,
				"height": 20,
				"weight": 2.5
			  });

			const token_ap = data_ap.token;
			console.log("sr token",token_ap);

			fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token_ap,
					},
					body: data_body
				})
				.then(response => {
					if (!response.ok) {
						throw new Error(response);
					}
					return response.json();
				})
				.then(data => {
					console.log('Order Created Successfully:', data);
				})
				.catch(error => {
					console.error('sr order:', error);
				});

		} catch (error) {
			console.error('Error:', error);
			res.status(500).json({
				message: "before login in ship",
			});
		}


	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "before Razo",
		});
	}
};

exports.verifyOrder = async (req, res) => {
	try {
		const userData = req.body;

		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			orderId,
			paid_on,
			amount_paid,
		} = userData;

		const sign = razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (expectedSign == razorpay_signature) {
			const order = await Order.findOneAndUpdate(
				{ _id: orderId },
				{
					$set: {
						paymentStatus: "paid",
						amountPaidOn: paid_on,
						amountPaid: amount_paid,
						razorPayId: razorpay_payment_id,
					},
				},
				{ new: true }
			);

			return res.status(200).json({
				success: true,
				message: "success",
				data: order,
				paymentStatus: "paid",
			});
		} else {
			await Order.updateOne(
				{ _id: orderId },
				{ $set: { paymentStatus: "failed" } }
			);

			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}
};

exports.showorders=async(req,res)=>{
	try{
        const record=await Order.find().sort({amountPaidOn:-1})
       // console.log(record)
        res.json({
            status:200,
            apiData:record,
            message:"success slection"
        })

    }catch(error){
        res.json({
            status:500,
            message:"interal error"
        })

    }
}

exports.showtotalordercount=async(req,res)=>{
    try {
        // Use a database query to get the total count of items
        const totalCount = await Order.countDocuments(); 
        // This is for MongoDB
    
        res.json({ 
            total_count: totalCount ,
            status:200,
            message:"success"
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    
 }
