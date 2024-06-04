
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const AdminModal= require('../modals/Reg')
const nodemailer=require('nodemailer')

const secret = 'test';

exports.signin = async (req, res) => {
   
  const { email, password } = req.body;
  

  try {
    const oldUser = await AdminModal.findOne({ email:email});
   

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
   

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

 exports.signup = async (req, res) => {
  const { email, password } = req.body;
  
  try{
     
     const hashedPassword = await bcrypt.hash(password, 12);
     const result = await AdminModal.create({ email, password: hashedPassword });

     const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );
 
     res.status(201).json({ result, token });
    
 
  }catch(error){
     res.json({
         status:500,
         message:'error.',
        
     })
 
  }

//   try {
//     const oldUser = await AdminModal.findOne({ email });

//     if (oldUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const result = await AdminModal.create({ email, password: hashedPassword });

//     const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

//     res.status(201).json({ result, token });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
    
//     console.log(error);
//   }
};

exports.forgotlink=async(req,res)=>{
  console.log(req.body)
  
   const {email}=req.body;
    if(!email){
      res.status(401).json({status:401,message:"Email does not exit! "})
    }
  
    try{
      const userfind= await AdminModal.findOne({email:email})    
      if(userfind) {

  const mailcheck=userfind.email
  // smtp seerver confi.
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "sharewithcoder@gmail.com",
        pass: "zzxm hkdk jvso tzdi",
      },
    });

    console.log("yeah that's great thinks that your server is connneted")
      const info = await transporter.sendMail({
        from: "Strategized👻'sharewithcoder@gmail.com'", // sender address
        to: email, // list of receivers
        subject: "Forgot link ", // Subject line
        text: "Pls click here to change password and make sure that link will actived only 5 min ", // plain text body
        html: `<a href=http://localhost:3000/newpass/${email}> forgot password?click here to change password</a>`
        // html body
      });
      console.log("sent your mail pls check mail & spum also")
      res.status(200).json({status:200,message:"A link sent your Registered mail id pls check"})
}
else{
res.status(400).json({status:400,message:"Entered mail is worng! kindly cheked your mail"})
}
      
    }catch(error){
      
      console.log('error fouded ');
      message:"somthing went wrong try again!"
          
    }
}

exports.newpasslink=async(req,res)=>{
  //console.log(req.params.user_email)
  
  
  const username= req.params.user_email
   try{
     const record= await AdminModal.find({email:username})
     //console.log(record)
     res.json({
        status:200,
        apiData:record,
      message:'suceess'
   })

 }catch(error){
    res.json({
        status:500,
        message:'server error'
    })
}
}
exports.newpasswordupdate=async(req,res)=>{
  const { password } = req.body;
  const userid=req.params.user_email
  try {
    const record1=await AdminModal.findOne({email:userid})
    // Hash the new password
    const hashedPassword=await bcrypt.hash(password,12)
    const newrecord=await AdminModal.findByIdAndUpdate(record1.id,{password:hashedPassword})

    if (newrecord) {
      console.log(newrecord);
      res.status(200).json({
        status: 200,
        message: "Successfully updated password",
        apiData: newrecord,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error updating password",
    });
  }
 
}


