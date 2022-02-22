const orderModel=require('../models/orderModel')
const asyncWrapper=require('../middleware/asyncWrapper')
const productModel=require('../models/productModel')
const ErrorHandler=require('../utils/errorHandler')

exports.newOrder=asyncWrapper(async(req,res,next)=>{

    const{shippingInfo,pinCode,phoneNumber,orderItems,paymentInfo,itemsPrice,tax,shippingCost,totalPrice}=req.body

    const order=await orderModel.create({
        shippingInfo,pinCode,phoneNumber,
        orderItems,
        paymentInfo,itemsPrice,
        tax,shippingCost,totalPrice,
        paidAt:Date.now,
        user:req.user._id})

    res.status(200).json({
        success:true,
        order
    })

})

// Single Order Details----Logged In User

exports.getSingleOrder=asyncWrapper(async(req,res,next)=>{

    const order=await orderModel.findById(req.params.id).populate(
        "user",
        "name email")

    if(!order){
        return next(new ErrorHandler("Order not Found ",404))
    }

    res.status(200).json({
        success:true,
        order
    })

})

// Get Order Details----Not Logged In User

exports.myOrders=asyncWrapper(async(req,res,next)=>{

    const orders=await orderModel.find({user:req.user._id})

    res.status(200).json({
        success:true,
        orders
    })
})

// Get All Orders....

exports.getAllOrders=asyncWrapper(async(req,res,next)=>{

    const orders=await orderModel.find()

    let totalAmount=0
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success:true,
        Amount:`Total Amount is ${totalAmount}`,
        orders        
    })
})

// Update Order Status

exports.updateOrderStatus=asyncWrapper(async(req,res,next)=>{

    const order=await orderModel.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not Found ",404))
    }

    if(order.orderStatus==='Deliverd'){
        
        next(new ErrorHandler("Order is Already Delivered. Status can not be Updated",404))
        
    }

    order.orderItems.forEach(async(orderItem)=>{
        await updateStock(orderItem.product,orderItem.quantity)
    })

    order.orderStatus=req.body.orderStatus

    if(req.body.orderStatus==="Delivered"){
        order.deliveredAt=Date.now()
    }

    await order.save({
        validateBeforeSave:false,

    })

    res.status(200).json({
        success:true,
                
    })
})

async function updateStock(id,quantity){
    const product= await productModel.findById(id)
    product.Stock-=quantity

   await product.save({validateBeforeSave:false})
}

// Delete Order

exports.deleteOrder=asyncWrapper(async(req,res,next)=>{

    const order=await orderModel.find(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not Found ",404))
    }

    order.remove()

    res.status(200).json({
        success:true,
               
    })
})