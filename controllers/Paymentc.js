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

		const recieptId = await crypto.randomBytes(10).toString("hex");

		const options = {
			amount: Number(req.body.amount),
			currency: "INR",
			receipt: recieptId,
		};

		let newOrder = new Order({
			amount: req.body.amount /100,
			purchaseDate: new Date(),
			orderId: crypto.randomBytes(10).toString("hex"),
			paymentStatus: "draft",
			productName: req.body.productDetails[0].pdtname,
			customerName:req.body.addressinfo.fullname,
			phone:req.body.addressinfo.phone,
			email:req.body.addressinfo.email,
			address:req.body.addressinfo.address,
			pincode:req.body.addressinfo.pincode,
			city:req.body.addressinfo.city,
			state:req.body.addressinfo.state,
			productDetailsName: req.body?.productDetails?.map(item => item.pdtname),
			purchaseDetailsName1: req.body?.purchaseDetails?.map(item => item.name1),
			purchaseDetailsName2: req.body?.purchaseDetails?.map(item => item.name2?item.name2:''),
		});

		const savedOrder = await newOrder.save();

		instance.orders.create(options, (error, order) => {
			
			if (error) {
				console.log("eror",error);
				return res.status(500).json({
					message:
						"Something went wrong while creating razorpay order.",
						data:
						error,
				});
			}

			return res.status(200).json({
				data: order,
				payment: instance,
				success: true,
				message: "success",
				orderId: newOrder._id,
				BodyReq: req.body,
			});

		});

	} catch (error) {
		res.status(500).json({
			message: "before Razo",
		});
	}
};

exports.createShipIn = async (req, res) => {

		console.log(req.body);
		
		const BodyAmount = req.body.BodyReq.amount/100;
		const BodyReq = req.body.BodyReq;
		const OrderId = req.body.OrderId;

		var customerName = BodyReq.addressinfo.fullname;
		var customerphone = BodyReq.addressinfo.phone;
		var customeremail = BodyReq.addressinfo.email;
		var customeraddress = BodyReq.addressinfo.address;
		var customerpincode = BodyReq.addressinfo.pincode;
		var customercity = BodyReq.addressinfo.city;
		var customerstate = BodyReq.addressinfo.state;

		try {

			const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
				maxBodyLength: Infinity,
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

			// const orders = BodyReq.productDetails.map((product) => {
			// 	return {
			// 	  name: product.pdtname,
			// 	  sku: product._id,
			// 	  units: 1, // Assuming each product is ordered once
			// 	  selling_price: product.price.toString(), // Converting to string as required
			// 	  discount: "0",
			// 	  tax: "0",
			// 	  hsn: 1189, // Not provided in the response
			// 	};
			// });

			const orders = [];
			const productDetails = BodyReq.productDetails;
			const purchaseDetails = BodyReq.purchaseDetails;

			for (let i = 0; i < productDetails.length; i++) {
				const product = productDetails[i];
				const purchase = purchaseDetails[i];
				const order = {
					name: product.pdtname,
					dualname1: purchase.name1,
					dualname2: purchase.name2,
					fontname: purchase.font,
					quantity: purchase.quantity,
					sku: product._id,
					units: 1, // Assuming each product is ordered once
					selling_price: product.price.toString(), // Converting to string as required
					discount: "0",
					tax: "0",
					hsn: 1189, // Not provided in the response
				};
				orders.push(order);
			}

			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
			const day = String(currentDate.getDate()).padStart(2, '0');
			const hours = String(currentDate.getHours()).padStart(2, '0');
			const minutes = String(currentDate.getMinutes()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
			const token_ap = data_ap.token;

			console.log("Token :",token_ap)

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

			console.log(data_pic)

			var data_body = {
				"order_id": OrderId.toString(),
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
				"sub_total": BodyAmount,
				"length": 10,
				"breadth": 15,
				"height": 20,
				"weight": 2.5
			  };



			

			  	const orderResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
					method: 'POST',
					maxBodyLength: Infinity,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token_ap,
					},
					body: JSON.stringify(data_body)
				})
				if (!response.ok) {
					return res.status(400).json({
					message:
						"Couldn't create order in Shiprocket.",
					});
				}
	
				const data_order = await orderResponse.json();
				
				console.log(data_order);
				// if(data_order){
					res.status(200).json({
						message: "success",
						data_order: data_order,
						data: BodyAmount,
						amount: BodyAmount,
					});
				// }

		} catch (error) {
			res.status(500).json({
				message: "before login in ship",
			});
		}

}

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


exports.trackOrder = async (req, res) => {
    const id = req.params.shipment_id;
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

		fetch("https://apiv2.shiprocket.in/v1/external/courier/track/shipment/"+id, {
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
				message: "Shipment Fetched Successfully",
				data: data,
				status: 200,
			});
		})

	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: error });
	}

}
