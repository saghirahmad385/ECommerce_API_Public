const express=require('express')
const productRouter=require('./routes/productRoutes')
const userRouter=require('./routes/usersRoute')
const oderRouter=require('./routes/orderRoutes')
const errorHandlerMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')

const app=express()


app.use(express.json())
app.use(cookieParser())

app.use('/api/v1',productRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',oderRouter)

app.use(errorHandlerMiddleware)

module.exports=app