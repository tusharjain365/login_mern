import {Link, useNavigate} from 'react-router-dom';
import profile from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { usernameValidate } from '../helper/validate';
import {useAuthStore} from '../store/store';

const Username=()=> {

    const setUsername= useAuthStore(state=> state.setUsername);
    const navigate=useNavigate();

    const formik=useFormik({
        initialValues:{
            username:'example123',
        },
        validate:usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values=>{
            setUsername(values.username);
            navigate('/password');
        }
    });

    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-3xl font-bold">Hello</h4>
                        <span className="py-2 text-xl w-3/4 text-center text-gray-500">Explore more by connecting with us</span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-2">
                            <img className={styles.profile_img} src={profile} alt="avatar" />
                        </div>
                        <div className="textbox flex flex-col items-center gap-4">
                            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username"/>
                            <button className={styles.btn} type="submit">Let's Go</button>
                        </div>
                        <div className="text-center py-2">
                            <span className="text-gray-500">Not a Member? <Link to="/register" className="text-red-500">Register Now</Link></span> 
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Username;