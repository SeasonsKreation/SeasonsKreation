const BannerModal = require('../modals/Banner')


exports.addbanner=async(req,res)=>{
    // console.log(req.file)
    try{
        const filename= req.file.filename
        const record = await  new BannerModal ({image:filename})
        record.save()
         res.json({
          status:200,
          message:'successfully.',
          apiData:record
      })
    }catch(error){
        res.json({
            status:500,
            message:'error',
      })

    }
}
exports.showBanner=async(req,res)=>{
    try{
        const record=await BannerModal.find()
       //console.log(record)
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
exports.Bannerdel=async(req,res)=>{
    const id=(req.params.id)
    try{
        await BannerModal.findByIdAndDelete(id)
        
        res.json({
            message:"successfully Deleted"
        })
    
     }catch(error){
      res.json({message:error.message})  
     }
}
exports.updatest=async(req,res)=>{
    const { id, newStatus } = req.params;

    try {
        const record = await BannerModal.updateOne(
            { _id: id },      // Filter criteria to identify the record by its ID
            { $set: { status: newStatus } } // Update only the 'status' field
        );
    
        // console.log(record);
    
        if (record.nModified > 0) {
            res.json({
                message: "Successfully Update",
                apiData: record,
                status: 200,
            });
        } else {
            res.json({
                message: "Record not found or status not modified",
                status: 404,
            });
        }
    } catch (error) {
        res.json({ message: error.message, status: 500 });
    }
    
}

exports.showuserBanner=async(req,res)=>{
    try{
        const record=await BannerModal.find({status:'Active'})
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