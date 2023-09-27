const UserModel=require("../model/User.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const env=require("../config");
const otpGenerator=require("otp-generator"); 

const verifyUser=async(req,res,next)=>{
    try{
        const {username}=req.method=="GET"?req.query:req.body;

        const ifExist=await UserModel.findOne({username});

        if(!ifExist) return res.status(404).send({error:"User doesn't exist"});
        next();
    }catch(error) {
        return res.status(401).send(error);
    }
}

async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        const ifUsernameExist=await UserModel.findOne({username});
        const ifEmailExist=await UserModel.findOne({email});

        if(ifUsernameExist||ifEmailExist) {
            return res.status(500).send({error:"user or email found"});
        }

        const hashPassword=await bcrypt.hash(password,10);

        if(!hashPassword) {
            return res.status(500).send({error:"password not hashed"});
        }

        const user=await UserModel.create({
            username,
            email,
            password:hashPassword,
            profile:profile||''
        });

        if(user) {
            res.status(201).send({msg:"User registered"});
        }else {
            res.status(500).send({error:"user not registered"});
        }

    } catch (error) {
        return res.status(500).send(error);
    }

}

const login=async(req,res)=>{
    const {username,password}=req.body;

    try {
        UserModel.findOne({username}).then(user=> {
            bcrypt.compare(password,user.password).then((passwordCheck)=>{
                if(!passwordCheck) {
                    return res.status(400).send({error:"Password needed"});
                }

                //jwt token
                const token=jwt.sign({
                    userId:user._id,
                    username:user.username
                },env.JWT_SECRET,{expiresIn:"24h"});

                return res.status(200).send({
                    msg:"Login success",
                    username:user.username,
                    token
                });

            }).catch(error=> {
                return res.status(400).send({error:"Password is not matching"});
            })
        }).catch(error=> {
            return res.status(404).send({error:"Email or password does not match"});
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const getUser=async(req,res)=>{
    const {username}=req.params;
    
    try{
        if(!username) return res.status(501).send({error:"Username is not valid"});

        UserModel.findOne({username}).select("-password").then((user)=>{
            if(!user) return res.status(404).send({error:"user not found"});

            return res.status(201).send(user);

        }).catch(error=> res.status(500).send({error}));

    }catch(error) {
        return res.status(500).send(error);
    }

}

const updateUser=async(req,res)=>{
    try{
        const {userId}=req.user;
        if(!userId) return res.status(401).send({error:"user not found"});

        const body=req.body;

        UserModel.updateOne({_id:userId},body).then((data)=>{
            return res.status(201).send({msg:"Record updated"});
        }).catch(error=> res.status(500).send(error));
        
    }catch(error) {
        return res.status(500).send(error);
    }

}

const generateOTP=async(req,res)=>{
    req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});

    return res.status(201).send({code:req.app.locals.OTP})

    // now to access otp inside verifyOTP, we will put otp in req.app.locals same as with token
}

const verifyOTP=async(req,res)=>{
    const {code}=req.query;

    if(parseInt(code)===parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP=null,
        req.app.locals.resetSession=true; // start session for reset password

        return res.status(201).send({msg:"OTP verified"});
    }

    return res.status(400).send({error:"OTP is not matching"});

}

// redirects user when OTP is verified
const createResetSession=async(req,res)=>{
    if(req.app.locals.resetSession) {
        // req.app.locals.resetSession=false; // access this route only once otherwise it will be redirected

        return res.status(201).send({flag:req.app.locals.resetSession});
    }

    return res.status(440).send({error:"Session expired"});

}

const resetPassword=async(req,res)=>{
    try {
        const {username,password}=req.body;
        if(!req.app.locals.resetSession) {
            return res.status(440).send({error:"Session expired"});
        }
        try {

            UserModel.findOne({username}).then((user)=>{
                bcrypt.hash(password,10).then((hashedPassword)=>{

                    UserModel.updateOne({username:user.username},{password:hashedPassword}).then((data)=>{
                        req.app.locals.resetSession=false;
                        return res.status(201).send({msg:"Record updated"});
                    }).catch(error=>{
                        return res.status(500).send({error});
                    })

                }).catch(error=>{
                    return res.status(500).send({error:"Unable to hash Password"});
                })
            }).catch(error=>{
                return res.status(404).send({error:"username not found"});
            })
            
        }catch(error) {
            return res.status(500).send(error);
        }
    }catch(error) {
        return res.status(500).send(error);
    }
}

module.exports={register,login,getUser,updateUser,resetPassword,createResetSession,generateOTP,verifyOTP,verifyUser}
