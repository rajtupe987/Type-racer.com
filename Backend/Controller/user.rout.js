const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const {userModel}=require("../model/usermode");

const {authenticate}=require("../middleware/auth")
const cookieparser=require("cookie-parser")
router.use(cookieparser())
const {blacklistModel}=require("../model/blacklistmodel")

require("dotenv").config();
// ************ register section************************

router.post("/signup", async (req, res) => {
    const { name, email, password,conformpassword } = req.body;
    const check = await userModel.findOne({ email });
    if (check) {
      return res.status(200).json({ "ok": false, "msg": "User already exist" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      try {
        if(err){
          res.send(err.message)
        }else{
          const data = new userModel({ name, email, password: hash,conformpassword });
          await data.save();
          res.status(200).json({ "ok": true, "msg": "Registered Successfully" });
        }
      } catch (error) {
        res.status(400).json({ "ok": false, "msg": error.message });
      }
  
    });
  })
  
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "User with this email not found", ok: false })
      }
      const isPasswordSame = await bcrypt.compare(password, user.password)
      if (!isPasswordSame) {
        return res.status(401).json({ msg: "Invalid email or password", ok: false })
      }
  
      //{ userId: user._id } == this is going to encoded into jwt
      const token = jwt.sign({ userId: user._id }, process.env.secrete_key, { expiresIn: '1hr' })
      const response = {
        "ok": true,
        "token": token,
        "msg": "Login Successfull",
        "id": user._id,
        "userName": user.name
      }
      res.status(200).json(response)
    } catch (error) {
      res.status(400).json({ "ok": false, "msg": error.message });
    }
  })
  
// ************ refreshtoken ************
router.get("/refreshtoken",async(req,res)=>{
    const refreshtoken = req.cookies.refreshToken;
    try {
        const isblacklist= await blacklistModel.findOne({ refreshToken:refreshtoken})
        if(isblacklist) return res.status(400).send({msg:"Please login"})
        if(refreshtoken){
            const isvalid=jwt.verify(refreshtoken,process.env.ref_key)
           
            if(isvalid){
            const newaccesstoken=jwt.sign({email:isvalid.email},process.env.secrete_key,{expiresIn:"6h"})
            res.cookie("accessToken",newaccesstoken,{maxAge:7*24*60*60*1000})
                res.send(newaccesstoken)
            }
        }else{
            res.status(400).send({"ok": false,"msg":"please login"})
        }
    } catch (error) {
        
        return res.send({"ok": false,"msg":error.message})
    }
   
})

// ****************logout***************


router.get("/logout",authenticate,async(req,res)=>{
    const {accessToken,refreshToken}=req.cookies
    const Baccesstoken= new blacklistModel({accessToken})
    await Baccesstoken.save()
    const Brefreshtoken= new blacklistModel({refreshToken})
    await Brefreshtoken.save()
    res.status(200).send({"ok": false,"msg":"logout successfull"})
})



module.exports={router}