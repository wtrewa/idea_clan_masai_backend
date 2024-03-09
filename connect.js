const { default: mongoose } = require("mongoose")

console.log(process.env.MONGO_DB);

const connect = async()=>{
    try {
      await  mongoose.connect(process.env.MONGO_DB)
      console.log('connection has built')
    } catch (error) {
        
    }
    
}

module.exports = connect;