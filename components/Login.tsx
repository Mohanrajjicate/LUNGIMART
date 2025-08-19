import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

// The client ID for your Google Cloud project.
const GOOGLE_CLIENT_ID = '763344556195-h5s3750ce89g1ttnb0if2h4hl98djmir.apps.googleusercontent.com';

const AuthComponent: React.FC = () => {
    const { loginWithGoogle } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const handleGoogleCallback = useCallback(async (response: any) => {
        try {
            // Decode the JWT to get user info.
            const userObject = JSON.parse(atob(response.credential.split('.')[1]));
            const { name, email } = userObject;

            // Call the context function which now hits the backend API.
            await loginWithGoogle({ name, email });

            const from = location.state?.from || '/profile';
            navigate(from, { replace: true });

        } catch (e) {
            console.error("Error processing Google login:", e);
            // Optionally show an error message to the user
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

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-center">
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In or Create an Account</h2>
            <p className="text-slate-600 mb-8">Use your Google account to continue.</p>
            <div className="flex justify-center" ref={googleButtonRef}></div>
             <p className="text-xs text-slate-400 mt-8">
                By continuing, you agree to LungiMart.in's Terms of Service and Privacy Policy.
            </p>
        </div>
    );
};

export default AuthComponent;
