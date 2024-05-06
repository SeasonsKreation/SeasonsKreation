const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../modals/Order.js");
const { use } = require("../router/routerapi.js");
require("dotenv").config();

exports.ordercreate = async (req, res) => {

	try {

		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_API_KEY,
			key_secret: process.env.RAZORPAY_API_SECRET,
		});

		const recieptId = await crypto.randomBytes(10).toString("hex")
		const options = {
			amount: Number(req.body.amount),
			 // use rupee * 100 (if the amount is 10 rupees put 1000).
			currency: "INR",
			receipt: recieptId,
		};

		let newOrder = new Order({
			amount: req.body.amount /100,
			purchaseDate: new Date(),
			orderId: crypto.randomBytes(10).toString("hex"),
			paymentStatus: "draft",
			productName: req.body.productDetails.pdtname,
			customerName:req.body.addressinfo.fullname,
			phone:req.body.addressinfo.phone,
			email:req.body.addressinfo.email,
			address:req.body.addressinfo.address,
			pincode:req.body.addressinfo.pincode,
			city:req.body.addressinfo.city,
			state:req.body.addressinfo.state,
		});

		await newOrder.save();

		// instance.orders.create(options, (error, order) => {
			
		// 	if (error) {
		// 		return res.status(500).json({
		// 			message:
		// 				"Something went wrong while creating razorpay order.",
		// 				data:
		// 				error,
		// 		});
		// 	}

		// 	return res.status(200).json({
		// 		data: order,
		// 		payment: instance,
		// 		success: true,
		// 		message: "success",
		// 		orderId: newOrder._id,
		// 	});

		// });

		
		var customerName = req.body.addressinfo.fullname;
		var customerphone = req.body.addressinfo.phone;
		var customeremail = req.body.addressinfo.email;
		var customeraddress = req.body.addressinfo.address;
		var customerpincode = req.body.addressinfo.pincode;
		var customercity = req.body.addressinfo.city;
		var customerstate = req.body.addressinfo.state;

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

			const orders = req.body.productDetails.map((product) => {
				return {
				  name: product.pdtname,
				  sku: product._id,
				  units: 1, // Assuming each product is ordered once
				  selling_price: product.price.toString(), // Converting to string as required
				  discount: "0",
				  tax: "0",
				  hsn: 1189, // Not provided in the response
				};
			});

			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
			const day = String(currentDate.getDate()).padStart(2, '0');
			const hours = String(currentDate.getHours()).padStart(2, '0');
			const minutes = String(currentDate.getMinutes()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
			const token_ap = data_ap.token;

			const picresponse = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
				method: 'GET',
				maxBodyLength: Infinity,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token_ap,
				},
			});			
			if (!response.ok) {
				return res.status(500).json({
				  message:
					  "Something went wrong while creating Shiprocket order.",
			  	});
		  	}

			const data_pic = await picresponse.json();

			var data_body = {
				"order_id": newOrder._id.toString(),
				"order_date": formattedDate.toString(),
				"pickup_location": data_pic.data.shipping_address[0].pickup_location.toString(),
				// "channel_id": ,
				"comment": "Reseller: M/s Goku",
				"reseller_name": "Reseller: M/s Goku",
				"company_name": "Reseller: M/s Goku",
				"billing_customer_name": customerName.toString(),
				"billing_last_name": customerName.toString(),
				"billing_address": customeraddress.toString(),
				"billing_address_2": customeraddress.toString(),
				"billing_city": customercity.toString(),

				"billing_pincode": parseInt(customerpincode),
				"billing_state": customerstate.toString(),
				"billing_country": "India",
				"billing_email": customeremail.toString(),
				"billing_phone": parseInt(customerphone),

				"shipping_is_billing": true,
				"shipping_customer_name": customerName.toString(),
				"shipping_last_name": customerName.toString(),
				"shipping_address": customeraddress.toString(),
				"shipping_address_2": customeraddress.toString(),
				"shipping_city": customercity.toString(),

				"shipping_pincode": parseInt(customerpincode),
				"shipping_country": "India",
				"shipping_state": customerstate.toString(),
				"shipping_email": customeremail.toString(),
				"shipping_phone": parseInt(customerphone),

				"order_items": orders,
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
			  };



			fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
				method: 'POST',
				maxBodyLength: Infinity,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token_ap,
				},
				body: JSON.stringify(data_body)
			})
			.then(response => {
				if (!response.ok) {
					throw new Error(response);
				}
				return response.json();
			})
			.then(data => {
				res.status(200).json({
					message: "success",
					data: data,
				});
			})
			.catch(error => {
				res.status(400).json({
					message: "Couldn't create order in Shiprocket",
					data: error,
				});
			});

		} catch (error) {
			res.status(500).json({
				message: "before login in ship",
			});
		}


	} catch (error) {
		res.status(500).json({
			message: "before Razo",
		});
	}
};

exports.countOrder = async (req, res) => {

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
		const token_ap = data_ap.token;
	
		fetch("https://apiv2.shiprocket.in/v1/external/orders", {
			method: 'GET',
			maxBodyLength: Infinity,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token_ap,
			},
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(response);
			}
			return response.json();
		})
		.then(data => {
			res.status(200).json({
				message: "Order Fetched Successfully",
				data: data.data.length,
			});
		})

	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}

}

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
