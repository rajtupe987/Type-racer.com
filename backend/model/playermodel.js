const mongoose=require("mongoose")
const PlayerSchema=mongoose.Schema({
    currrentwordindex:{
        type:Number,
        default:0
    },
    socketID:{type:String},
    isPartyLeader:{
        type:Boolean,
        default:false
    },
    wpm:{
  type:Number,
  default: -1
    },
    nickName:{
        type:String
    }
})
const GameSchema=mongoose.Schema({
    words:[{type:String}],
    isOpen:{type:Boolean,default:true},
    isOver:{type:Boolean,default:false},
    players:[PlayerSchema],
    startTime:{type:Number}
})

module.exports=mongoose.model("game",GameSchema)