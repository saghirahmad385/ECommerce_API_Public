const app= require('./app')
const dotenv=require('dotenv')
const cloudinary=require('cloudinary')
// const connectDB=require('./config/database')

const mongoose=require('mongoose')

// Handling uncaught exceptions
// process.on('uncaughtException',(error)=>{
//     console.log(`Error :${error.message}`)
//     console.log("Shutting down the server due to unhandled promise rejection")

//     server.close(()=>{
//         process.exit(1)
//     })
// })

// config

// 

dotenv.config({path:'backend/config/config.env'})

cloudinary.config({
  cloud_name:"dixbcy17o",
  api_key:156383897497549,
  api_secret:"P3fivFGbCcFet3tx3OyVsyBsmNE"
})

const DB_URL="mongodb://localhost:27017/6Pack_Ecommerce"

const DB_URL2="mongodb://saghirahmad385:CA10796skan@cluster0-shard-00-00.ih9zo.mongodb.net:27017,cluster0-shard-00-01.ih9zo.mongodb.net:27017,cluster0-shard-00-02.ih9zo.mongodb.net:27017/e_commerce_db?replicaSet=atlas-kta0bh-shard-0&ssl=true&authSource=admin"

mongoose.connect(DB_URL2)
.then(()=>{
    console.log("Successfully Connected to Database...")
    app.listen(process.env.PORT || 5500,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log(error)
})


// connectDB(DB_URL)
// const server=app.listen(process.env.PORT,()=>{
//     console.log(`Server is running on port ${process.env.PORT}`)
// })

// unhandled promise rejection

// process.on("unhandledRejection",(error)=>{
//     console.log(`Error: ${error.message}`)
//     console.log("Shutting down the server due to unhandled promise rejection")

//     server.close(()=>{
//         process.exit(1)
//     })
// })


// await is only valid in async functions and the top level bodies of modules