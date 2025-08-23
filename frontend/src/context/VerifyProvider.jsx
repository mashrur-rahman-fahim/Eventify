import { useEffect, useState } from "react";
import api from "../utils/api";
import { VerifyContext } from "./verifyContext";
export const VerifyProvider = ({children}) => {
    const [isVerified,setIsVerified]=useState(false);
    const [isLoading,setIsLoading]=useState(true);
    useEffect(()=>{
       const checkLogin=async()=>{
        try {
            setIsLoading(true);
            await api.get("/api/isLoggedIn");
            setIsVerified(true);

        } catch (error) {
            setIsVerified(false);
            console.log(error);
            
        }
        finally{
            setIsLoading(false);

        }
       }
       checkLogin();
    },[])

    return <VerifyContext.Provider value={{isVerified,setIsVerified,isLoading}}>{children}</VerifyContext.Provider>
}