const mongoose = require('mongoose')
async function connect (){
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to Database')
    } catch (error) {
        console.log(error)
    } 
}
connect()