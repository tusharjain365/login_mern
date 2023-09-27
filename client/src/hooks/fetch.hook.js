//this is made to fetch the user data and make it available through all the components.
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getUsername } from '../helper/helper';

axios.defaults.baseURL=process.env.REACT_APP_SERVER_DOMAIN;

//custom hook
const useFetch=(query)=>{
    const [getData,setData]=useState({isLoading:false,apiData:undefined,status:null,serverError:null});

    useEffect(()=>{

        const fetchData=async()=> {
            try {

                setData((pre)=>({...pre,isLoading:true}));

                const {username}=!query?await getUsername():'';
    
                const {data,status}=!query?await axios.get(`/api/user/${username}`):await axios.get(`/api/${query}`);

                if(status===201) {
                    setData((pre)=>({...pre,isLoading:false,apiData:data,status:status}));
                }
                setData((pre)=> ({...pre,isLoading:false}));
                
            } catch (error) {
                setData((pre)=> ({...pre, isLoading:false,serverError:error}));
            }
        }
        fetchData();
        
    },[query]);

    return [getData,setData];
}

export default useFetch;