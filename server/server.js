const express=require('express');
const cors=require('cors');
const connectDB=require('./database/conn');
const router=require('./router/route');

const app=express();

//middlewares
app.use(express.json());
app.use(cors());
app.disable('x-powered-by') // less hackers know tech-stack

const port=8080;

app.get('/',(req,res)=>{
    res.status(201).json("this is root");
});

app.use('/api',router);

connectDB().then(()=>{
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})
