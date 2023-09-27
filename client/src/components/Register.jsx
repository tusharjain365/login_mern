import {Link, useNavigate} from 'react-router-dom';
import profile from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { useState } from 'react';
import convertToBase64 from '../helper/convert';
import { registerValidate } from '../helper/validate';
import {registerUser} from '../helper/helper';

const Register=()=> {

    const [file,setFile]=useState();
    const navigate=useNavigate();

    const formik=useFormik({
        initialValues:{
            email:'',
            username:'',
            password:'admin@123',
        },
        validate:registerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values=>{
            values=await Object.assign(values,{profile:file||''});
            const registerPromise=registerUser(values);
            toast.promise(registerPromise,{
                loading:'Creating your profile..',
                success: <b>Profile created</b>,
                error: <b>Profile could not created.</b>
            });

            registerPromise.then(()=>{
                navigate('/');
            })
        }
    });

    const onUpload=async e=> {
        const base64=await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-3xl font-bold">Register</h4>
                        <span className="py-2 text-xl w-2/3 text-center text-gray-500">Happy to connect with you</span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-2">
                            <label htmlFor="profile">
                                <img className={styles.profile_img} src={file||profile} alt="avatar" />
                            </label>

                            <input onChange={onUpload} type="file" id='profile' name='profile'/>
                        </div>
                        <div className="textbox flex flex-col items-center gap-4">
                            <input {...formik.getFieldProps('email')} className={styles.textbox} type="email" placeholder='Email'/>
                            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username'/>
                            <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password'/>
                            <button className={styles.btn} type="submit">Register</button>
                        </div>
                        <div className="text-center py-2">
                            <span className="text-gray-500">Already Registered?<Link to="/" className="text-red-500">Login</Link></span> 
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Register;