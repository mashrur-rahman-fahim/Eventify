import React, { useContext, useEffect } from 'react'
import { VerifyContext } from '../context/VerifyProvider'
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useState } from 'react';
export const ClubAdmin = () => {
    const navigate=useNavigate();
    const {isAdmin,isVerified,isLoading,checkLogin}=useContext(VerifyContext);
    const [formClub,setFormClub]=useState({
        name:"",
        description:"",
    });
    const [club,setClub]=useState([]);
    useEffect(()=>{
        checkLogin();
    },[checkLogin]);
    useEffect(()=>{
        if((!isAdmin || !isVerified )&& !isLoading){
            navigate("/");
        }
    },[isAdmin,isVerified,isLoading,navigate]);
    useEffect(()=>{
        const fetchClubs=async()=>{
            try {
                const response=await api.get("/api/club/getClubByUserId");
                setClub(response.data.clubs);
            } catch (error) {
                console.log(error);
            }
        }
        fetchClubs();
    },[])
    const createClub=async()=>{
        try {
            const response=await api.post("/api/club/create",formClub);
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }


  return (
    <div></div>
  )
}
