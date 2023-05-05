const mongoose=require("mongoose")
const connect=mongoose.connect("mongodb+srv://khirod:khirodsamal@cluster0.yvhnl0b.mongodb.net/typeRacer?retryWrites=true&w=majority")
module.exports={connect}
