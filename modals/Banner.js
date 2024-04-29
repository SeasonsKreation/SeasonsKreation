const mongoose=require('mongoose')


const BannerSchema=  mongoose.Schema({
    
    image:String,
    status:{type:String,default:'Inactive'}
})

module.exports=mongoose.model('Banner', BannerSchema)