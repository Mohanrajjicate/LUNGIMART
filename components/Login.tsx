
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const LoginComponent: React.FC = () => {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const { findUserByPhone, addUser, login } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const FAKE_OTP = '123456';

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        setStep('otp');
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === FAKE_OTP) {
            let user = findUserByPhone(phone);
            if (!user) {
                // New user signup
                user = addUser(phone);
            }
            login(user);
            
            // Redirect if came from another page like checkout
            const from = location.state?.from || '/';
            navigate(from, { replace: true });

        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    const OtpInput: React.FC = () => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            // Allow only numbers and limit length to 6
            if (/^\d*$/.test(value) && value.length <= 6) {
                setOtp(value);
            }
        };

        return (
            <input 
                type="tel"
                value={otp}
                onChange={handleInputChange}
                className="w-full text-center text-2xl tracking-[1em] font-mono bg-slate-100 rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                maxLength={6}
                autoComplete="one-time-code"
                required
                autoFocus
            />
        );
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            {step === 'phone' ? (
                 <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Login or Signup</h2>
                    <p className="text-center text-slate-600 mb-6">Enter your mobile number to get an OTP.</p>
                    <form className="space-y-4" onSubmit={handlePhoneSubmit}>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-500 sm:text-sm">+91</span>
                                </div>
                                <input 
                                    type="tel" 
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    maxLength={10}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 pl-12" 
                                    placeholder="98765 43210" 
                                    required 
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Send OTP
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Enter OTP</h2>
                    <p className="text-center text-slate-600 mb-2">We've sent a 6-digit OTP to +91 {phone}.</p>
                    <div className="text-center bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-2 rounded-lg my-4">
                        For demo purposes, your OTP is: <strong className="font-bold">{FAKE_OTP}</strong>
                    </div>
                    <form className="space-y-4" onSubmit={handleOtpSubmit}>
                        <div>
                            <label htmlFor="otp" className="sr-only">Enter OTP</label>
                            <OtpInput />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                         <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Verify & Continue
                        </button>
                    </form>
                    <div className="text-center text-sm text-slate-500 mt-4 flex justify-between">
                        <button onClick={() => { setStep('phone'); setError(''); setOtp(''); }} className="font-medium text-primary hover:underline">
                            Change Number
                        </button>
                         <button onClick={() => alert("A new OTP has been sent!")} className="font-medium text-primary hover:underline">
                            Resend OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginComponent;
