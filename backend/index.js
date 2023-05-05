const express=require("express")
const app=express()
app.use(express.json())
const {connect}=require("./database/db");
const {router}=require("./controller/user.rout")
const socketio=require("socket.io")

app.get("/",(req,res)=>{
    res.send("wellcome")
})
app.use("/user",router)

app.listen(9000,async()=>{
    try {
        await connect
        console.log("connect to db")
    } catch (error) {
        
    }
    console.log("server is running at port 9000")
})