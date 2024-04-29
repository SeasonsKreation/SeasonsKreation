const mongoose=require('mongoose')


const ReviewSchema=  mongoose.Schema({
    pdtname:{
        type:String,
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    
    status:{type:String,default:'Inactive'}
})

module.exports=mongoose.model('Reviewmodal', ReviewSchema)