const mongoose=require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question: {type:String,required:true  },
    annotations:{type:Array,required:false,default:[],index:true},
})

module.exports=mongoose.model('questions',QuestionSchema);
