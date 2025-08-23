import {  useState } from "react";
import api from "../utils/api";
import { VerifyContext } from "./VerifyContext";
export const VerifyProvider = ({children}) => {
    const [isVerified,setIsVerified]=useState(false);
    const [isLoading,setIsLoading]=useState(true);
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


    return <VerifyContext.Provider value={{isVerified,setIsVerified,isLoading,checkLogin}}>{children}</VerifyContext.Provider>
}