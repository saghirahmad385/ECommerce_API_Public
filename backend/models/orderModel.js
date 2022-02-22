const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{type:String,required:[true,"Please Provide Shipping Address"]},
        city:{type:String,required:[true,"Please Enter City Name"]},
        state:{type:String,required:[true,"Please Enter State Name"]},
        country:{type:String,required:[true,"Please Enter Country Name"]}
    },
    pinCode:{
        type:Number,
        required:[true,"Please Enter Pin Code"]
    },
    phoneNumber:{
        type:Number,
        required:[true,"Please Enter Phone Number"]
    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'Product',
            required:true
        },
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        paidAt:{
            type:Date,
            required:true,
            default:Date.now()
        }
    },
        itemsPrice:{
            type:Number,
            default:0
        },
        tax:{
            type:Number,
            default:0
        },
        shippingCost:{
            type:Number,
            default:0
        },
        totalPrice:{
            type:Number,
            default:0
        },
    
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    craetedAt:{
        type:Date,
        default:Date.now()
    }
})

const orderModel=mongoose.model('Order',orderSchema)

module.exports=orderModel