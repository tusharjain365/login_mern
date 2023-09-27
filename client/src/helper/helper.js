import axios from 'axios';
import jwt_decode from 'jwt-decode';

//to connect backend with frontend, specify baseurl for axios to make request to and append api's url to it
axios.defaults.baseURL=process.env.REACT_APP_SERVER_DOMAIN;

//to get user from token generated after login

export const getUsername=async()=>{

    const token=localStorage.getItem('token');

    if(!token) return Promise.reject("Cannot find Token");

    const decode=jwt_decode(token);

    return decode;
}

export const authenticate=async(username)=>{
    try{

        return await axios.post("/api/authenticate",{username});
    }catch(error) {
        return {error:"User is not authenticated"};
    }
}

export const getUser=async({username})=>{
    try {

        const {data}=await axios.get(`/api/user/${username}`);
        return {data};
    }catch(error) {
        return {error:"Please enter correct password"};
    }
}

export const registerUser=async(credentials)=>{
    try {

        const {data:{msg},status}=await axios.post('/api/register',credentials);

        const {username,email}=credentials;

        if(status===201) {
            await axios.post('/api/registerMail',{username,userEmail:email,text:msg});
        }
        
        return Promise.resolve(msg);

    }catch(error) {
        return Promise.reject({error});
    }
}

export const verifyPassword=async({username,password})=>{
    try{
        const {data}=await axios.post('/api/login',{username,password});

        return Promise.resolve({data});
    }catch(error) {
        return Promise.reject({error:"User not verified"});
    }
}

export const updateUser=async(response)=>{
    try{

        const token=await localStorage.getItem('token');
        const data=await axios.put('/api/updateUser',response,{headers:{"Authorization":`Bearer ${token}`}});

        return Promise.resolve({data});

    }catch(error) {
        return Promise.reject({error:"Information cannot be updated"});
    }
}

export const generateOTP=async(username)=>{
    try {
        const {data:{code}, status}=await axios.get('/api/generateOTP',{params:{username}});

        if(status===201) {
            const {data:{email}}=await getUser({username});

            //sent OTP on this email
            const text=`Your password recovery OTP is ${code}`;

            await axios.post('/api/registerMail',{username,userEmail:email,text,subject:"Password recovery OTP"});

            return Promise.resolve(code);
        }
    }catch(error) {
        return Promise.reject({error});
    }
}


export const verifyOTP=async({username,code})=>{
    try {
        const {data,status}=await axios.get('/api/verifyOTP',{params:{username,code}});
        return {data,status};
    }catch(error) {
        return Promise.reject({error});
    }
}

export const resetPassword=async({username,password})=>{
    try {
        const {data,status}=await axios.put('/api/resetPassword',{username,password});
        
        return Promise.resolve({data,status});
    }catch(error) {
        return Promise.reject(error);
    }
}