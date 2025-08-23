import React, { useContext, useEffect } from 'react'
import { VerifyContext } from '../context/VerifyContext'
import { useNavigate } from 'react-router-dom'
import { ClubAdmin } from '../components/ClubAdmin'

export const ClubPage = () => {
    const {isAdmin,isVerified,isLoading,checkLogin}=useContext(VerifyContext)
    const navigate=useNavigate()
    useEffect(()=>{
        checkLogin()
       
    },[checkLogin])
    
    useEffect(()=>{
        if((!isAdmin || !isVerified) && !isLoading){
            navigate("/")
        }
    },[isAdmin,isVerified,isLoading,navigate])
  
    return (
    <div><ClubAdmin/></div>
  )
}
