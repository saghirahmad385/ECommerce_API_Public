const express=require('express')
const productRouter=require('./routes/productRoutes')
const userRouter=require('./routes/usersRoute')
const oderRouter=require('./routes/orderRoutes')
const errorHandlerMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')
const cors=require('cors')
var bodyParser = require('body-parser')
const fileupload=require('express-fileupload')
const cookiesMiddleware = require('universal-cookie-express')

const app=express()

const setHeaders=(req, res, next) => {
  res.header( "Access-Control-Allow-Origin","https://react-9qdvsz.stackblitz.io");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials",true)   
  next();
};

app.use(cookiesMiddleware())


app.use(cors({
  origin: 'https://react-9qdvsz.stackblitz.io',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(fileupload())

app.use(cookieParser())

app.use('/api/v1',setHeaders,productRouter)
app.use('/api/v1',setHeaders,userRouter)
app.use('/api/v1',setHeaders,oderRouter)

app.use(errorHandlerMiddleware)

module.exports=app

