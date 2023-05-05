const express=require("express")
const grout=express.Router()
const  Game=require("../model/playermodel")
const axios=require("axios")
const url="https://api.quotable.io/random";
 const getData=()=>{
    return axios.get(url).then(response=> response.data.content.split(" "))
 }

