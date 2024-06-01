const ReviewModal=require('../modals/Reviewmodal')


exports.addreview=async(req,res)=>{
    // console.log(req.body)
    // console.log(req.file)
    const {text,pname}=req.body
    try{
   
        if(req.file){
    const filename= req.file.filename
    
     const record = await  new ReviewModal ({image:filename,text:text,pdtname:pname})
     record.save()
     res.json({
      status:200,
      message:'successfully.',
      apiData:record
  })
  }else{
      const record = await new ReviewModal ({text:text,pdtname:pname})
      record.save()
      res.json({
          status:200,
          message:'successfully.',
          apiData:record
      })
   }
  

}catch(error){
  res.json({
      status:500,
      message:'error.',
      
  })

}

}

exports.showAllreview=async(req,res)=>{
    try{
        const record=await ReviewModal.find()
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
 
exports.showonadminpanel=async(req,res)=>{
    try{
        const record=await ReviewModal.find()
        console.log(record)
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

exports.reviewdelbyadmin=async(req,res)=>{
    const id = req.params.id;
	try {
		await ReviewModal.findByIdAndDelete(id);
		res.json({
			status: 200,
			message: "successfully Deleted",
		});
	} catch (error) {
		res.json({ message: error.message });
	}
}