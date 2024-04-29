const mongoose=require('mongoose')


const SubemailSchema=  mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
   })

module.exports=mongoose.model('Subemail', SubemailSchema)