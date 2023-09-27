import styles from '../styles/Username.module.css';
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { resetPasswordValidate } from '../helper/validate';
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';

const Reset=()=> {

    const {username}=useAuthStore(state=> state.auth);
    const navigate=useNavigate();
    const [{isLoading,apiData,status,serverError}]=useFetch('createResetSession');

    const formik=useFormik({
        initialValues:{
            password:'admin@123',
            confirm_pwd:'admin@123',
        },
        validate:resetPasswordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values=>{
            const resetPromise=resetPassword({username, password:values.password});

            toast.promise(resetPromise,{
                loading:'Loading..',
                success: <b>Password reset succesfully</b>,
                error: <b>Error in resetting password</b>
            })

            resetPromise.then(()=>{
                navigate('/password');
            })
        }
    });

    if(isLoading) return <h1 className="text-2xl font-bold text-center">Loading</h1>
    if(serverError) return <h1 className="text-xl text-red-500 text-center">{serverError.message}</h1>
    if(status && status!==201) return <Navigate to={'/password'} replace={true}></Navigate>

    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-3xl font-bold">Reset Password</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">Reset your password here..</span>
                    </div>

                    <form className="py-20" onSubmit={formik.handleSubmit}>
                        <div className="textbox flex flex-col items-center gap-6">
                            <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='New Password'/>
                            <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="text" placeholder='Confirm Password'/>
                            <button className={styles.btn} type="submit">Reset</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Reset;