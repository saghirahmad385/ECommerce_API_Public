const mongoose=require('mongoose')
const { MAX_LENGTH } = require('picomatch/lib/constants')

const productSchema= new mongoose.Schema({
        name:{
            type:String,
            required:[true,"Please enter product name"],
            trim:true
        },
        description:{
            type:String,
            required:[true,"Please enter product description"]
        },
        price:{
            type:Number,
            required:[true,'Please enter product price'],
            MAX_LENGTH:[8,'price can not exceed 8 characters']
        },
        ratings:{
            type:Number,
            default:0
        },
        images:[{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }],
        category:{
            type:String,
            required:[true,'Please enter product category']
        },
        Stock:{
            type:Number,
            required:[true,"Please enter product stock"],
            maxlength:[4,'Stock can not exceed 4 characters'],
            default:1
        },
        numOfReviews:{
            type:Number,
            default:0
        },
        reviews:[{
            name:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
           }          
        }],
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        craetedAt:{
            type:Date,
            default:Date.now
       }
})

const productModel=mongoose.model("Product",productSchema)

module.exports=productModel




