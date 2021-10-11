const mongoose=require('mongoose')

const TopicSchema = new mongoose.Schema({
    topic: {type:String,required:true, index: true  },
    parent:{type:String,required:false,default:null},
})

module.exports=mongoose.model('topics',TopicSchema);
