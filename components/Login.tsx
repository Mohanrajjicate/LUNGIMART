import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

// The client ID for your Google Cloud project.
const GOOGLE_CLIENT_ID = '763344556195-h5s3750ce89g1ttnb0if2h4hl98djmir.apps.googleusercontent.com';

const AuthComponent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="flex border-b border-slate-200 mb-6">
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Sign Up
                </button>
            </div>

            {activeTab === 'login' ? <LoginTab /> : <SignupTab />}
        </div>
    );
};

const Separator: React.FC = () => (
    <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-300" />
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">OR</span>
        </div>
    </div>
);

const LoginTab: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithGoogle } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const handleGoogleCallback = (response: any) => {
        try {
            // In a real app, send `response.credential` (the JWT) to your backend for verification.
            // For this simulation, we'll decode it on the client side.
            const userObject = JSON.parse(atob(response.credential.split('.')[1]));
            const { name, email } = userObject;

            const result = loginWithGoogle({ name, email });

            if (result.success) {
                const from = location.state?.from || '/profile';
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } catch (e) {
            console.error("Error decoding Google credential:", e);
            setError("Failed to process Google sign-in.");
        }
    };

    useEffect(() => {
        if (typeof (window as any).google !== 'undefined' && googleButtonRef.current) {
            (window as any).google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
            });
            (window as any).google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large", type: "standard", text: "signin_with", width: 320 }
            );
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = login(phone, password);
        if (result.success) {
            const from = location.state?.from || '/profile';
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back!</h2>
            <p className="text-center text-slate-600 mb-6">Login to your account to continue.</p>
            <form className="space-y-4" onSubmit={handleLogin}>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark">
                    Login
                </button>
            </form>
            <Separator />
            <div className="flex justify-center" ref={googleButtonRef}></div>
        </div>
    );
};

const SignupTab: React.FC = () => {
    const { findUserByEmail, findUserByPhone, addUser, login, loginWithGoogle } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', birthday: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const FAKE_OTP = '123456';
    
    const handleGoogleCallback = (response: any) => {
        try {
            const userObject = JSON.parse(atob(response.credential.split('.')[1]));
            const { name, email } = userObject;
            
            // The `loginWithGoogle` function will handle both login and signup flows.
            const result = loginWithGoogle({ name, email });

            if (result.success) {
                const from = location.state?.from || '/profile';
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } catch (e) {
            console.error("Error decoding Google credential:", e);
            setError("Failed to process Google sign-up.");
        }
    };
    
    useEffect(() => {
        if (typeof (window as any).google !== 'undefined' && googleButtonRef.current) {
            (window as any).google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
            });
            (window as any).google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large", type: "standard", text: "signup_with", width: 320 }
            );
        }
    }, []);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.'); return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.'); return;
        }
        if (findUserByEmail(formData.email)) {
            setError('An account with this email already exists.'); return;
        }
        if (findUserByPhone(formData.phone)) {
            setError('An account with this phone number already exists.'); return;
        }
        setStep('otp');
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === FAKE_OTP) {
            addUser({
                name: formData.name, email: formData.email, phone: formData.phone,
                password: formData.password, birthday: formData.birthday
            });
            login(formData.phone, formData.password);
            navigate('/profile', { replace: true });
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            {step === 'details' ? (
                <>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Create an Account</h2>
                    <p className="text-center text-slate-600 mb-6">Join us to get the best of traditional wear.</p>
                    <form className="space-y-4" onSubmit={handleDetailsSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300"/>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark">
                            Continue
                        </button>
                    </form>
                    <Separator />
                    <div className="flex justify-center" ref={googleButtonRef}></div>
                </>
            ) : (
                 <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Email Verification</h2>
                    <p className="text-center text-slate-600 mb-2">We've sent a 6-digit OTP to {formData.email}.</p>
                    <div className="text-center bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-2 rounded-lg my-4">
                        This email is from <strong className="font-mono">login@lungimart.in</strong>. <br/> For demo purposes, your OTP is: <strong className="font-bold">{FAKE_OTP}</strong>
                    </div>
                    <form className="space-y-4" onSubmit={handleOtpSubmit}>
                        <div>
                            <label className="sr-only">Enter OTP</label>
                            <input 
                                type="tel"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-2xl tracking-[1em] font-mono bg-slate-100 rounded-lg border-slate-300"
                                maxLength={6}
                                required
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                         <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark">
                            Verify & Create Account
                        </button>
                    </form>
                     <div className="text-center text-sm text-slate-500 mt-4">
                        <button onClick={() => setStep('details')} className="font-medium text-primary hover:underline">
                            &larr; Back to details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthComponent;