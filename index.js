const express = require('express');
const cors = require('cors')
require('dotenv').config()
const connect = require('./connect')
const studentRoute = require('./routes/studentRoute');
const adminRoute = require('./routes/adminRoute');
const CourseRouter = require('./routes/courseRoute');

// create express app .
const app = express();
app.use(cors())
app.use(express.json())
app.use('/api',studentRoute)
app.use('/api',adminRoute)
app.use('/api',CourseRouter)


app.get('/',(req,res)=>{
    res.send('welcome to home page')
})




app.listen(8080,()=>{
    connect()
    console.log('port is running on 8080 ')
})