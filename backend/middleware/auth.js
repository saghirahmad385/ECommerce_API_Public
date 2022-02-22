const asyncWrapper=require('./asyncWrapper')
const ErrorHandler=require('../utils/errorHandler')
const jwt=require('jsonwebtoken')
const userModel=require('../models/userModel')

exports.isAuthenticatedUser=asyncWrapper(async(req,res,next)=>{
    const {token}=req.cookies

    if(!token){
        return next(new ErrorHandler("Please login to viw this page",401) )
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET)   

    req.user=await userModel.findById(decodedData.id)

    next()
})

exports.authorizeRoles=(...roles)=>{
    
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access resource`,403))
        } 
        next()       
    }
}

