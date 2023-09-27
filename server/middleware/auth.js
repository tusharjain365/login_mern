const jwt=require("jsonwebtoken");
const env=require("../config");

const auth=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];

        const decodedToken=jwt.verify(token,env.JWT_SECRET);

        req.user=decodedToken;

        next();
    }catch(error) {
        res.status(401).send({error:"Authentication failed"});
    }
}

const localVariables=(req,res,next)=>{
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next();
}

module.exports={auth,localVariables};