const router = require("express").Router();

const jwt = require("jsonwebtoken");

const Adminreg = require("../controllers/adminregc");
const Bannerc = require("../controllers/Bannerc");
const AdPdtc = require("../controllers/Adpdtc");
const Reviewc = require("../controllers/Reviewc");
const PaymentC = require("../controllers/Paymentc");
const SubemaiC=require('../controllers/Subemailc')
const multer = require("multer");

router.post("/checkout", PaymentC.ordercreate);
router.post("/verifyPayment", PaymentC.verifyOrder);
router.get("/countOrder", PaymentC.countOrder);
router.post("/createShipIn", PaymentC.createShipIn);
router.get('/showorders',PaymentC.showorders)
router.delete('/mmdel/:id',PaymentC.orderdel)
router.get('/totalordercount',PaymentC.showtotalordercount)
router.get("/track_order/:shipment_id", PaymentC.trackOrder);

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/upload");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

let upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 15 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png, .jpg and  .jpeg  allowed!"));
		}
	},
});
let multiple = upload.fields([
	{ name: "image", maxCount: 1 },
	{ name: "image2", maxCount: 1 },
]);


router.post("/signin", Adminreg.signin);
router.post("/signup", Adminreg.signup);
router.post("/forgotpasslinksend", Adminreg.forgotlink);
router.get("/newpass/:user_email", Adminreg.newpasslink);
router.put("/newpass_update/:user_email", Adminreg.newpasswordupdate);

// Banner Config.
router.post("/addbanner", upload.single("image"), Bannerc.addbanner);
router.get("/showbanner", Bannerc.showBanner);
router.put("/adminbannertoggle/:id/:newStatus", Bannerc.updatest);
router.delete("/adminbannerdel/:id", Bannerc.Bannerdel);
router.get("/showuserBanner", Bannerc.showuserBanner);

//product config.
router.post("/addpdt", multiple, AdPdtc.addpdtfromadmin);
router.get("/showpdt", AdPdtc.showpdtfromdb);
router.delete("/pdtdel/:id", AdPdtc.pdtdel);
router.get("/singlepddata/:id", AdPdtc.singleid);
router.put("/productupdate/:id", multiple, AdPdtc.updatepdt);
router.get("/showuserpdt", AdPdtc.showuserpdt);
router.get('/showusersinglepdt',AdPdtc.showusersinglepdtt)
router.get("/showuserpdtsingle/:id", AdPdtc.showusersinglepd);
router.post("/productbyid", AdPdtc.ids);
router.get('/totalpdt',AdPdtc.showtotalpdtcount)

//review config
router.post("/addreview", upload.single("image"), Reviewc.addreview);
router.get("/showalluserreview", Reviewc.showAllreview);
router.get("/showreviewonadmin", Reviewc.showonadminpanel);


//subemai
router.post('/addsubemail',SubemaiC.addsubemail)
router.get('/showsubemails',SubemaiC.showAllsubsemail)
router.delete('/adminsubemaildel/:id',SubemaiC.subdel)

module.exports = router;

module.exports = router;
