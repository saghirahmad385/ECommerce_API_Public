const ErrorHandler=require('../utils/errorHandler')
const asyncWrapper=require('../middleware/asyncWrapper')
const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const nodeMailer=require('nodemailer')


// Create new user
exports.registerUser=asyncWrapper(async(req,res,next)=>{
    const email=req.body.email;

    const user=await userModel.findOne({email:email})

    if(user){
        
        return next(new ErrorHandler("Email already registered",400))
    }

    
    const newUser=await userModel.create(req.body)

    const newToken=newUser.getJWTToken()

    res.status(201).cookie('token',newToken,{
        httpOnly:true,
        expires:new Date(Date.now+5*900000)

    }).json({
        newUser,
        newToken
    })
   
})
// Login user system
exports.loginUser=asyncWrapper(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400))
    }
    let user= await userModel.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Email or password",401))
    }  
    const userPassword=user.password
    

    const matchPassword=await bcrypt.compare(String(password),userPassword)

   if (!matchPassword){
       return next(new ErrorHandler("Invalid Email or password",401))
   }

    const newToken=user.getJWTToken()

    res.status(200).cookie('token',newToken,{
        httpOnly:true,
        expires:new Date(Date.now()+5*100000)

    }).json({
        user,
        newToken
    })
})

// LogOut User System

exports.logOut=asyncWrapper(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        message:"successfully logged out..."
    })

})

// Forget Password
exports.forgetPassword=asyncWrapper(async(req,res,next)=>{

    const email=req.body.email

    const user= await userModel.findOne({email})

    if(!user){
        return next(new ErrorHandler('Invalid e-mail address..',404))
    }
    const resetToken=crypto.randomBytes(20).toString('hex')
    
    user.resetPasswordToken= crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
    
    
    console.log(user.resetPasswordToken)

    user.resetPasswordExpire=Date.now() + 15 * 60 * 1000

    console.log(user.resetPasswordExpire)

    await user.save({validateBeforeSave:false})

    console.log(user.email)

    const resetPasswordURL=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message=`Your password reset token is :\n\n ${resetPasswordURL} \n\n If you have not requested this email
    please ignore it`

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user:"skhanfx1@gmail.com",
          pass:"CA10796skan",
          clientId:"952980084447-6d987gqn5mjqb49usnm4ord492r0vv8a.apps.googleusercontent.com",
          clientSecret:"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",
          refreshToken:"1//04OLPuibMwHczCgYIARAAGAQSNwF-L9IrYSDOL4reGNqdSpvnJdcdeKtgnx4kHgozy4DGfvNi2Bp50lqt9H6IvwIe-tctnvo6iw0"
        }
      });
      
      const mailOptions={
        from:"skhanfx1@gmail.com",
        to:user.email,
        subject:"Password Reset Email",
        text:resetPasswordURL
      }
  

    try {

        res.status(200).json({
            message:"welcome",
            user
        })

        await transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log("email sent to user")
            }
          })
        
    }
        
     catch (error) {
        user.resetPasswordToken=undefined,
        user.resetPasswordExpire=undefined

        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500))
    }

})

// Reset Password
exports.resetPassword=asyncWrapper(async(req,res,next)=>{
    const resetToken=req.params.token

    const resetPasswordToken= crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    const user=await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        next(new ErrorHandler('Password reset link is invalid or has been expired',400))
    }
    const password=req.body.password
    const confirmPassword=req.body.confirmPassword

    if(!password || !confirmPassword){
        return next(new ErrorHandler('Please enter both fields',400))
    }

    if(password !== confirmPassword){
        return next(new ErrorHandler("Passwords do not match,please try again",400))
    }

    user.password=password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()

    const newToken=user.getJWTToken()

    res.status(200)
    .cookie('token',newToken,{
        httpOnly:true,
        expires:new Date(Date.now()+5*100000)

    })
    .json({
        user,
        newToken
    })
})

// Get User Details
exports.getUserDetails=asyncWrapper(async(req,res,next)=>{

   const user=await userModel.findById(req.user.id)

   res.status(200).json({
       success:true,
       user

   })
})

exports.updatePassword=asyncWrapper(async(req,res,next)=>{
    
    const user=await userModel.findById(req.user.id).select('+password')

    const oldPassword=req.body.oldPassword

    if(!oldPassword){
        return next(new ErrorHandler('Please enter old password',400))
    }

    const isPasswordMatch=await bcrypt.compare(String(oldPassword),user.password)

    if(!isPasswordMatch){
        return next(new ErrorHandler('Password entered is incorrect',400))
    }
    const {newPassword,confirmNewPassword}=req.body
    if(!newPassword || !confirmNewPassword){
        return next(new ErrorHandler('Please Enter Both fields',400))
    }

    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler("Passwords do not match",400))
    }

    user.password=newPassword

    await user.save()

    const token=user.getJWTToken()

    res.status(200)
    .cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+5*100000)
    })
    .json({
        success:true,
        message:"Password Successfully changed"
    })
})

// Updating User Profile

exports.updateProfile=asyncWrapper(async(req,res,next)=>{
    const newDetails={
        name:req.body.name,
        email:req.body.email
    }

    const user=await userModel.findByIdAndUpdate(req.user._id,newDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
})

// Get All users---Admin Route
exports.getAllUsers=asyncWrapper(async(req,res,next)=>{

    const users=await userModel.find()

    res.status(200).json({
        success:true,
        users
    })
})

// Get Single User Details----Admin Route

exports.getSingleUser=asyncWrapper(async(req,res,next)=>{

    const user=await userModel.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User not Found with id ${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        user
    })

})

// Update User Role---Admin
exports.updateUserRole=asyncWrapper(async(req,res,next)=>{

    const newDetails={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await userModel.findByIdAndUpdate(req.params.id,newDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    }) 
})

// Deleting A User----Admin

exports.deleteUser=asyncWrapper(async(req,res,next)=>{

    const user=await userModel.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User not Found with Id ${req.params.id}`,404))
    }

    await user.remove()

    res.status(200).json({
        success:true,
        message:"User removed from database"
    })

})




