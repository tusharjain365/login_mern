import styles from '../styles/Username.module.css';
import toast, {Toaster} from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import { useState } from 'react';
import { useEffect } from 'react';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

const Recovery=()=> {

    const {username}=useAuthStore(state=>state.auth);

    const [OTP,setOTP]=useState();
    const navigate=useNavigate();

    useEffect(()=>{
        generateOTP(username).then((OTP)=>{
            if(OTP) return toast.success("OTP sent to the registered email id");

            return toast.error("Error while generating OTP");
        })
    },[username]);

    const onSubmit=async(e)=>{
        e.preventDefault();

        try {
            const{status}=await verifyOTP({username,code:OTP});
    
            if(status===201) {
                toast.success("OTP verified succefully");
    
                return navigate('/reset');
            }
        } catch (error) {
            return toast.error("OTP not matching");
        }
    }

    const resendOTP=()=> {
        const sendPromise=generateOTP(username);

        toast.promise(sendPromise,{
            loading:"Sending...",
            success: <b>OTP sent to your email</b>,
            error: <b>OTP not sent</b>
        })

    }

    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-3xl font-bold">Recovery</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">Enter OTP to recover password</span>
                    </div>

                    <form className="pt-20" onSubmit={onSubmit}>
                        <div className="textbox flex flex-col items-center gap-4">

                            <div className="input text-center">
                                <span className="py-4 text-sm text-left text-gray-500">Enter 6 digit OTP sent to your email address</span>
                                <input onChange={(e)=>setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP' autoComplete='off'/>
                                <button className={styles.btn} type="submit">Sign in</button>
                            </div>
                            
                        </div>
                    </form>
                    <div className="text-center py-2">
                        <span className="text-gray-500">Can't get OTP? <button onClick={resendOTP} className="text-red-500">Resend</button></span> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recovery;