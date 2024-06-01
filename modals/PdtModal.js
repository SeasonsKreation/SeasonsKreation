const mongoose=require('mongoose')


const PdtSchema=  mongoose.Schema({
    pdtname:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    image2:{
        type:String,
        required:true,
    },
    pcname:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    
    status:{type:String,default:'Inactive'}
})

module.exports=mongoose.model('PdtModal', PdtSchema)