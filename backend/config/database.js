const mongoose=require('mongoose')

const connectDB=async(DB_URL)=>{
    try {
        await mongoose.connect(DB_URL)
    } catch (error) {
        console.log(error)
    }
}

module.exports=connectDB