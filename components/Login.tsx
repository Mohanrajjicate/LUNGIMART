

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

// The client ID for your Google Cloud project.
const GOOGLE_CLIENT_ID = '763344556195-h5s3750ce89g1ttnb0if2h4hl98djmir.apps.googleusercontent.com';

const AuthComponent: React.FC = () => {
    const { loginWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhone } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    
    // Form States
    const [signInData, setSignInData] = useState({ identifier: '', password: '' });
    const [signUpData, setSignUpData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password enhancement states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    
    const passwordChecklist = [
        { key: 'length' as keyof typeof passwordCriteria, label: '8+ characters' },
        { key: 'uppercase' as keyof typeof passwordCriteria, label: '1 uppercase letter' },
        { key: 'lowercase' as keyof typeof passwordCriteria, label: '1 lowercase letter' },
        { key: 'number' as keyof typeof passwordCriteria, label: '1 number' },
        { key: 'special' as keyof typeof passwordCriteria, label: '1 special character' },
    ];

    const validatePassword = (password: string) => {
        const newCriteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
        setPasswordCriteria(newCriteria);
        return Object.values(newCriteria).every(Boolean);
    };

    const handleGoogleCallback = useCallback((response: any) => {
        try {
            const userObject = JSON.parse(atob(response.credential.split('.')[1]));
            const { name, email } = userObject;

            const result = loginWithGoogle({ name, email });

            if (result.success) {
                if (result.isNewUser) {
                    navigate('/signup', { replace: true });
                } else {
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
        const { name, value } = e.target;
        if (name === 'password') {
            validatePassword(value);
        }
        setSignUpData({ ...signUpData, [name]: value });
    };

    const handleSignInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setTimeout(() => { // Simulate network delay
            let result;
            if (loginMethod === 'email') {
                result = signInWithEmail({ email: signInData.identifier, password: signInData.password });
            } else {
                result = signInWithPhone({ phone: signInData.identifier, password: signInData.password });
            }

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
        const isPasswordValid = validatePassword(signUpData.password);
        if (!isPasswordValid) {
            setError("Password does not meet all the requirements.");
            setIsPasswordFocused(true); // Show the criteria if they try to submit
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
        setSignInData({ identifier: '', password: '' });
        setSignUpData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setIsPasswordFocused(false);
        setPasswordCriteria({ length: false, uppercase: false, lowercase: false, number: false, special: false });
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
                     <div className="flex border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => { setLoginMethod('email'); setSignInData({ identifier: '', password: signInData.password }); setError(''); }}
                            className={`w-full py-3 text-sm font-semibold transition-colors focus:outline-none ${
                                loginMethod === 'email'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
                            }`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginMethod('phone'); setSignInData({ identifier: '', password: signInData.password }); setError(''); }}
                            className={`w-full py-3 text-sm font-semibold transition-colors focus:outline-none ${
                                loginMethod === 'phone'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
                            }`}
                        >
                            Phone
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 capitalize">{loginMethod}</label>
                        <input 
                            type={loginMethod === 'email' ? 'email' : 'tel'} 
                            name="identifier"
                            value={signInData.identifier}
                            onChange={handleSignInChange} 
                            placeholder={loginMethod === 'email' ? 'you@example.com' : '9876543210'}
                            required 
                            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                        />
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
                        <div className="relative mt-1">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={signUpData.password}
                                onChange={handleSignUpChange}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                required
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                         {(isPasswordFocused || (signUpData.password.length > 0 && !Object.values(passwordCriteria).every(Boolean))) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3 p-3 bg-slate-50 rounded-md">
                                {passwordChecklist.map(({ key, label }) => (
                                    <div key={key} className={`flex items-center transition-colors ${passwordCriteria[key] ? 'text-green-600' : 'text-slate-500'}`}>
                                        {passwordCriteria[key] ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                                        )}
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={signUpData.confirmPassword}
                                onChange={handleSignUpChange}
                                required
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                               {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
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