const mongoose = require('mongoose')

module.exports = async()=>{
    try{
        mongoose.connect(process.env.DB_URL)
        console.log('connected DB')
    }catch(e){
        console.error(e)
        console.log
    }
}