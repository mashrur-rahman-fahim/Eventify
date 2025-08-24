import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import ThemeSwitcher from '../components/ThemeSwitcher';

export const VerifyEmail = () => {
    const {token}=useParams();
    const navigate=useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'

    useEffect(()=>{
        const verifyEmail=async()=>{
            try {
                await api.get(`/api/verify/${token}`);
                console.log("Email verified");
                setStatus('success');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                
            } catch (error) {
                console.log(error);
                setStatus('error');
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
                
            }
        }
        verifyEmail();
    },[token,navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 relative overflow-hidden">
      {/* Navbar */}
      <div className="navbar bg-base-100/90 shadow-lg backdrop-blur-md">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
            Eventify
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <Link to="/chatbot" className="btn btn-ghost text-primary font-semibold">
            🤖 AI Assistant
          </Link>
          <ThemeSwitcher />
          <Link to="/login" className="btn btn-ghost">
            Sign In
          </Link>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Verification Container */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/50">
          <div className="card-body p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <h2 className="text-2xl font-bold text-base-content mb-2">Verifying Email</h2>
                <p className="text-base-content/70">Please wait while we verify your email address...</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-success mb-2">Email Verified!</h2>
                <p className="text-base-content/70 mb-4">Your email has been successfully verified. Redirecting to login...</p>
                <div className="loading loading-spinner loading-sm text-success"></div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-error mb-2">Verification Failed</h2>
                <p className="text-base-content/70 mb-4">Sorry, we couldn't verify your email. Redirecting to login...</p>
                <div className="loading loading-spinner loading-sm text-error"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
