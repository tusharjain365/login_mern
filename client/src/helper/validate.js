// used for validing the form fields
import toast from 'react-hot-toast';
import {authenticate} from './helper';

export const usernameValidate=async (values)=>{
    const errors=usernameVerify({},values);

    if(values.username) {
        const {status}=await authenticate(values.username);

        if(status!==200) {
            errors.exist=toast.error("Invalid username");
        }
    }
    return errors;
}

export const passwordValidate=async (values)=>{
    const errors=passwordVerify({},values);

    return errors;
}

export const resetPasswordValidate=async (values)=>{
    const errors=passwordVerify({},values);

    if(values.password!==values.confirm_pwd) {
        errors.exist=toast.error("Password is not matching..");
    }
    return errors;
}

export const profileValidation=(values)=>{
    const errors=emailVerify({},values);

    return errors;
}

export const registerValidate=async (values)=>{
    const errors=usernameVerify({},values);
    passwordVerify(errors,values);
    emailVerify(errors,values);

}

const emailVerify=(error={},values)=>{
    if(!values.email) {
        error.email=toast.error("Email is required..");
    }else if(values.email.includes(' ') || !values.email.includes('@')) {
        error.email=toast.error("Email is not valid");
    }

    return error;
}

const passwordVerify=(error={},values)=> {
    if(!values.password) {
        error.password=toast.error("Password required..");
    }else if(values.password.includes(" ")) {
        error.password=toast.error("Password should not contain space..");
    }else if(values.password.length<4) {
        error.password=toast.error("Password should be of atleast 4 characters..");
    }

    return error;
}

const usernameVerify=(error={},values)=>{
    if(!values.username) {
        error.username=toast.error("Username Required..");
    }else if(values.username.includes(" ")) {
        error.username=toast.error("Username should not contain space..");
    }

    return error;
}