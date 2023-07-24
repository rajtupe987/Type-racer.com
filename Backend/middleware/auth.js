const jwt =require("jsonwebtoken");
const {blacklistModel}=require("../model/blacklistmodel")

require("dotenv").config()
const authenticate=async(req,res,next)=>{
    const token=req.headers.authorization
    try {
        if(token){
            const tokenblacklist=await blacklistModel.findOne({accessToken:token})
            if(tokenblacklist){
                return res.status(401).send({"msg":"please login"})
            }
            const decoded=jwt.verify(token,process.env.secrete_key)
            if(decoded){
                req.body.email=decoded.email
                next()
            }else{
                return res.status(400).send({"msg":"please login"})
            }

        }else{
            return res.status(400).send({"msg":"please login"})
        }
    } catch (error) {
        res.status(500).send({"msg":"something weent wrong on authenticate"})
    }
}

module.exports={authenticate}