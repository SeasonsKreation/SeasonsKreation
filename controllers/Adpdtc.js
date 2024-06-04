const Pdtmodal = require("../modals/PdtModal");

exports.addpdtfromadmin = async (req, res) => {
	const { pdtname, price, pcname,descpdt } = req.body;
	 console.log(req.body)
	 console.log(req.files)
	try {
		if (req.files) {
			const filename1 = req.files.image[0].filename;
			const filename2 = req.files.image2[0].filename;
			const imagesraw = req.files['imagesraw[]'] ? req.files['imagesraw[]'].map(file => file.filename) : [];
			
			const record = new Pdtmodal({
				image: filename1,
				image2: filename2,
				pdtname: pdtname,
				price: price,
				desc:descpdt,
				pcname:pcname || "singlename",
				imagesraw: imagesraw,
			});
			record.save();
			res.json({
				status: 200,
				message: "Product add successfully.",
				apiData: record,
			});
		} else {
			const record = await new Pdtmodal({
				pdtname: pdtname,
				price: price,
				desc:descpdt,
				pcname:pcname || "singlename"
			});
			record.save();
			res.json({
				status: 200,
				message: "Product add successfully without image .",
				apiData: record,
			});
		}
	} catch (error) {
		res.json({
			status: 500,
			message: "Internal server error",
		});
	}
 };

exports.showpdtfromdb = async (req, res) => {
	try {
		const record = await Pdtmodal.find();
		res.json({
			status: 200,
			apiData: record,
			message: "success slection",
		});
	} catch (error) {
		res.json({
			status: 500,

			message: "interal error",
		});
	}
};

exports.pdtdel = async (req, res) => {
	const id = req.params.id;
	try {
		await Pdtmodal.findByIdAndDelete(id);
		res.json({
			status: 200,
			message: "successfully Deleted",
		});
	} catch (error) {
		res.json({ message: error.message });
	}
};

exports.singleid = async (req, res) => {
	const id = req.params.id;
	try {
		const record = await Pdtmodal.findById(id);
		res.json({
			status: 200,
			apiData: record,
			message: "suceess",
		});
	} catch (error) {
		res.json({
			status: 500,
			message: "server error",
		});
	}
};

exports.updatepdt = async (req, res) => {
	// console.log(req.params.id)
	// console.log(req.body)
	// console.log(req.file)
	const { pdtname, price, st,pcname,descpdt } = req.body;
	const id = req.params.id;
	try {
		if (req.files) {
			// const filename1 = req.files.image[0].filename;
			// const filename2 = req.files.image2[0].filename;

			const op = {
				// image: filename1,
				// image2: filename2,
				pdtname: pdtname,
				price: price,
				status: st,
				pcname:pcname,
				desc:descpdt,
			};

			if (req.files?.image?.length > 0) {
				op.image = req.files.image[0].filename;
			}

			if (req.files?.image2?.length > 0) {
				op.image2 = req.files.image2[0].filename;
			}

			const record = await Pdtmodal.findByIdAndUpdate(id, op);

			// console.log({ record });


			res.json({
				status: 200,
				message: " successfully Update",
				apiData: record,
			});
		} else {
			const record = await Pdtmodal.findByIdAndUpdate(id, {
				pdtname: pdtname,
				price: price,
				status: st,
				pcname:pcname,
				desc:descpdt,
			});
			res.json({
				status: 200,
				message: " successfully Update without img",
				apiData: record,
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			status: 500,
			message: "error",
		});
	}
};

// exports.showuserpdt = async (req, res) => {
// 	try {
// 		const conditions = { status: "Active"};
		
// 		if (req.query.pcname) {
//             conditions.pcname = req.query.pcname;
//         }
// 		const record = await Pdtmodal.find(conditions);
// 		console.log(conditions)
// 		res.json({
// 			status: 200,
// 			apiData: record,
// 			message: "success slection",
// 		});
// 	} catch (error) {
// 		res.json({
// 			status: 500,

// 			message: "interal error",
// 		});
// 	}
// };
exports.showuserpdt = async (req, res) => {
    try {
        const record = await Pdtmodal.find({ status: 'Active', pcname: 'dualname' });

        res.json({ 	
            status: 200,
            apiData: record,
            message: "success selection",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "internal error",
        });
    }
};
exports.showusersinglepdtt = async (req, res) => {
    try {
        const record = await Pdtmodal.find({ status: 'Active', pcname: 'singlename' });

        res.json({ 	
            status: 200,
            apiData: record,
            message: "success selection",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "internal error",
        });
    }
};


exports.showusersinglepd = async (req, res) => {
	const id = req.params.id;
	try {
		const record = await Pdtmodal.findById(id);
		res.json({
			status: 200,
			apiData: record,
			message: "suceess",
		});
	} catch (error) {
		res.json({
			status: 500,
			message: "server error",
		});
	}
};

exports.ids = async (req, res) => {
	// console.log(req.body)
	const { ids } = req.body;
	try {
		
		// const records = [];
		// for (const id of ids) {
		// 	const record = await Pdtmodal.find({ _id: id });
		// 	records.push(...record);
		// }
		// console.log(records);
		// res.json({
		// 	status: 200,
		// 	apiData: records,
		// 	message: "success",
		// });

		const records = [];
		for (let i = 0; i < ids.length; i++) {
			
			const id = ids[i];
			const record = await Pdtmodal.find({ _id: id });
			records.push(...record);

		}

		console.log(records);
		res.json({
			status: 200,
			apiData: records,
			message: "success",
		});

	} catch (error) {
		res.json({
			status: 500,
			message: "server error",
		});
	}
};

exports.showtotalpdtcount=async(req,res)=>{
    try {
        // Use a database query to get the total count of items
        const totalCount = await Pdtmodal.countDocuments(); 
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
