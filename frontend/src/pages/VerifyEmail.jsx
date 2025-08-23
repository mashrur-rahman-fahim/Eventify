import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const VerifyEmail = () => {
    const {token}=useParams();
    const navigate=useNavigate();
    useEffect(()=>{
        const verifyEmail=async()=>{
            try {
                await api.get(`/api/verify/${token}`);
                console.log("Email verified");
                    navigate("/login");
                
            } catch (error) {
                console.log(error);
                navigate("/login");
                
            }
        }
        verifyEmail();
    },[token,navigate])

  return (
    <div>verifyEmail</div>
  )
}
