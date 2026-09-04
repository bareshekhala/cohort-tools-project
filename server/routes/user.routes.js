const express = require("express")
const router = express.Router()
const User = require("../models/User.model")
const { verifyToken } = require("../middlewares/auth.middlewares")

router.get("users/:id", verifyToken, async (req,res,next)=>{
    try{

const user = await User.findById(req.params.id).select("-password")

if(!user){
    res.status(404).json({errorMessage: "User not found"})
}

res.json(user)
    }catch(error){
        next(error)
    }
})

module.exports = router;