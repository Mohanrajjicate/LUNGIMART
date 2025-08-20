

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

// The client ID for your Google Cloud project.
const GOOGLE_CLIENT_ID = '763344556195-h5s3750ce89g1ttnb0if2h4hl98djmir.apps.googleusercontent.com';

const AuthComponent: React.FC = () => {
    const { loginWithGoogle, signInWithEmail, signUpWithEmail } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
    
    // Form States
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleGoogleCallback = useCallback((response: any) => {
        try {
            // In a real app, send `response.credential` (the JWT) to your backend for verification.
            // For this simulation, we'll decode it on the client side.
            const userObject = JSON.parse(atob(response.credential.split('.')[1]));
            const { name, email } = userObject;

            const result = loginWithGoogle({ name, email });

            if (result.success) {
                if (result.isNewUser) {
                    // New user, redirect to the signup page to complete profile
                    navigate('/signup', { replace: true });
                } else {
                    // Existing user, redirect to profile or original destination
                    const from = location.state?.from || '/profile';
                    navigate(from, { replace: true });
                }
            } else {
                setError(result.message);
            }
        } catch (e) {
            console.error("Error decoding Google credential:", e);
            setError("Failed to process Google sign-in.");
        }
    }, [loginWithGoogle, navigate, location.state]);

    useEffect(() => {
        if (typeof (window as any).google !== 'undefined' && googleButtonRef.current) {
            (window as any).google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
            });
            // To prevent rendering multiple times if the effect re-runs.
            if(googleButtonRef.current.childElementCount === 0) {
                 (window as any).google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "outline", size: "large", type: "standard", text: "continue_with", width: 320 }
                );
            }
           
        }
    }, [handleGoogleCallback]);
    
    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    const handleSignInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setTimeout(() => { // Simulate network delay
            const result = signInWithEmail(signInData);
            if (result.success) {
                const from = location.state?.from || '/profile';
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }, 500);
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (signUpData.password !== signUpData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => { // Simulate network delay
            const result = signUpWithEmail(signUpData);
            if (result.success) {
                 const from = location.state?.from || '/profile';
                 navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }, 500);
    };

    const toggleAuthMode = () => {
        setError('');
        setSignInData({ email: '', password: '' });
        setSignUpData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setAuthMode(prev => prev === 'signIn' ? 'signUp' : 'signIn');
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {authMode === 'signIn' ? 'Sign In' : 'Create an Account'}
            </h2>
            <p className="text-slate-600 mb-6">
                {authMode === 'signIn' ? 'to continue to LungiMart' : 'to get started'}
            </p>
            
            <div className="flex justify-center" ref={googleButtonRef}></div>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {authMode === 'signIn' ? (
                <form onSubmit={handleSignInSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                        <input type="tel" name="phone" value={signUpData.phone} onChange={handleSignUpChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
            )}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            
            <p className="text-sm text-slate-500 mt-6">
                {authMode === 'signIn' ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleAuthMode} className="font-semibold text-primary hover:underline ml-1">
                    {authMode === 'signIn' ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
    );
};

export default AuthComponent;