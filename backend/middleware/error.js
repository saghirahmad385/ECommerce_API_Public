const ErrorHandler=require('../utils/errorHandler')

const errorHandlerMiddleware=(error,req,res,next)=>{
    error.statusCode=error.statusCode || 500
    error.message=error.message

    if(error.name==="CastErrorr"){
        const message=`Resource not found. Invalid:${error.path}`
       return error=new ErrorHandler(message,400)
    }

    if(error.name==="JsonWebTokenError"){
        const message="Json Web Token is invalid. Please try again"
        err=new ErrorHandler(message,400)
    }

    if(error.name==="ToeknExpiredError"){
        const message="Json Web Token is Expired. Please try again"
        err=new ErrorHandler(message,400)
    }

    res.status(error.statusCode).json({
        success:false,
        error:error.message
    })
}
module.exports=errorHandlerMiddleware