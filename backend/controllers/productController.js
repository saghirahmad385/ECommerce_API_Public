const productModel=require('../models/productModel')
const asyncWrapper=require('../middleware/asyncWrapper')
const ErrorHandler=require('../utils/errorHandler')
const ApiFeatures=require('../utils/apifeatures')
// Create Product--Admin
const createProduct=asyncWrapper(async(req,res,next)=>{
    req.body.user=req.user._id

    const product=await productModel.create(req.body)
    res.status(200).json(product)
})

// Get All Products
const getAllProducts=asyncWrapper(async(req,res,next)=>{

    const resultPerPage=5
    const productCount= await productModel.countDocuments()

    const apiFeature= new ApiFeatures(productModel.find(),req.query).search().filter()
    const products=await apiFeature.query
    res.status(200).json({products,productCount})
})

// Get Single Product

const getSingleProduct=asyncWrapper(async(req,res,next)=>{
    const productId=req.params.id
    const singleProduct=await productModel.findById(productId)

    if(!singleProduct){
        return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({singleProduct})

})

// Update product--Admin
const updateProduct=asyncWrapper(async(req,res,next)=>{
    const productId=req.params.id 
    let product= await productModel.findById(productId)

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    const updatedProduct=await productModel.findByIdAndUpdate(productId,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json(updatedProduct)
})

// Delete Product

const deleteProduct=asyncWrapper(async (req,res,next)=>{

    const productId=req.params.id 
    let product= await productModel.findById(productId)

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    await product.remove()

    res.status(200).json({
        message:'product deleted successfully....'
    })

})


// Create New Review OR Update Reviews

const createProductReview=asyncWrapper(async(req,res,next)=>{
    const {rating,comment,productId}=req.body

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
        productId
    }

    const product=await productModel.findById(productId)


    const isReviewed=product.reviews.find(review=>review.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString()===req.user._id.toString()){
                review.rating=rating
                review.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }

    let aggregateRating=0
    const totalRating=product.reviews.forEach(review=>{
        
       return aggregateRating+=review.rating
    })
    
    product.ratings=aggregateRating/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        message:"Review Updated"
    })

})

// All reviews of a product
const allReviews=asyncWrapper(async(req,res,next)=>{

    
    const product=await productModel.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not Found",404))

    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

// Delete Reviews
const deleteReview=asyncWrapper(async(req,res,next)=>{

    const product=await productModel.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler('Product not found ',404))
    }  
    
    const filteringReviews=(review)=>{
        return review.user.toString()!==req.user._id.toString()
    }

    const reviews=product.reviews.filter(filteringReviews)

    const numOfReviews=product.reviews.length

    let aggregateRating=0
    const totalRating=product.reviews.forEach(review=>{
        
       return aggregateRating+=review.rating
    })
    
    const ratings=aggregateRating/product.reviews.length

    await productModel.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:false,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        product
    })


})


module.exports={createProduct, getAllProducts,updateProduct,deleteProduct,getSingleProduct,createProductReview,allReviews,deleteReview}



