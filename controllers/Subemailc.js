const Subemail=require('../modals/Subemials')

exports.addsubemail=async(req,res)=>{
    
    const {subemail}=req.body
    console.log(req.body)
    try{
       const record= new Subemail({email:subemail})
       record.save()
       res.json({
        status:200,
        message:'successfully.',
        apiData:record
       })
       
   }catch(error){
  res.json({
      status:500,
      message:'error.',
      
  })

}

}
exports.showAllsubsemail=async(req,res)=>{
    try{
        const record=await Subemail.find()
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
exports.subdel=async(req,res)=>{
    const id = req.params.id;
	try {
		await Subemail.findByIdAndDelete(id);
		res.json({
			status: 200,
			message: "successfully Deleted",
		});
	} catch (error) {
		res.json({ message: error.message });
	}
}