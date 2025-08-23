import React, { useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";

export const LoginPage = () => {
    const navigate = useNavigate();
    const {isVerified,isLoading,checkLogin}=useContext(VerifyContext);
    useEffect(()=>{
        checkLogin();
    },[checkLogin])
    useEffect(()=>{
        if(isVerified && !isLoading){
            navigate("/");
        }

    },[isVerified,isLoading,navigate])
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/isEmailVerified", formData);
      
      if (!response.data.success) {
        await api.post("/api/resendVerificationEmail", formData);
      }
      await api.post("/api/login", formData);
    
     navigate("/");

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};
