const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please neter your name"],
        maxlength:[30,"Name can not exceed 30 characters"],
        minlength:[4,"Name can not be less than 4 charaters"]
    },
    email:{
        type:String,
        unique:[true,"Email address is alraedy registered"],
        required:[true,"Please enter your email adress"],
        validate:[validator.isEmail,"Please eneter a avalid emaial address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password can not be loewr than 8 characters"],
        select:false
        
    },
    avatar:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
          default:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxhbGx8fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit"
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

// Password hashing
userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
       return next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

// JWT Token

userSchema.methods.getJWTToken=function (){
     const token=jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
    return token
}

const userModel=mongoose.model('User',userSchema)

module.exports=userModel