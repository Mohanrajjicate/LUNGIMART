
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SignupPage: React.FC = () => {
    const { pendingGoogleUser, completeSignup } = useAppContext();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [personalDetails, setPersonalDetails] = useState({
        name: '',
        birthday: '',
        phone: ''
    });
    const [addressDetails, setAddressDetails] = useState({
        name: '',
        street: '',
        city: '',
        zip: ''
    });

    useEffect(() => {
        if (!pendingGoogleUser) {
            // If there's no pending user, they shouldn't be here. Redirect them.
            navigate('/profile');
        } else {
            // Pre-fill name from Google and create a default address name
            setPersonalDetails(prev => ({ ...prev, name: pendingGoogleUser.name }));
            setAddressDetails(prev => ({ ...prev, name: `${pendingGoogleUser.name} (Home)` }));
        }
    }, [pendingGoogleUser, navigate]);
    
    const handlePersonalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };
    
    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        completeSignup({
            ...personalDetails,
            address: addressDetails
        });
        // On completion, context will set the user and we can navigate to the profile page
        navigate('/profile');
    };
    
    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressDetails({ ...addressDetails, [e.target.name]: e.target.value });
    };


    if (!pendingGoogleUser) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-slate-900 text-center">Complete Your Profile</h1>
            <p className="text-slate-500 text-center mt-2">Welcome! Just a few more details to get you set up.</p>

            <div className="w-full bg-slate-200 rounded-full h-2.5 my-8">
                <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
            </div>

            {step === 1 && (
                <form onSubmit={handlePersonalSubmit} className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-semibold text-slate-800">Step 1: Personal Details</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" name="name" value={personalDetails.name} onChange={handlePersonalChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                        <input type="date" name="birthday" value={personalDetails.birthday} onChange={handlePersonalChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input type="tel" name="phone" value={personalDetails.phone} onChange={handlePersonalChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                            Next: Address &rarr;
                        </button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleAddressSubmit} className="space-y-6 animate-fade-in">
                     <h2 className="text-xl font-semibold text-slate-800">Step 2: Default Address</h2>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Address Label</label>
                        <input type="text" name="name" value={addressDetails.name} onChange={handleAddressChange} required placeholder="e.g., Home, Work" className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Street Address</label>
                        <input type="text" name="street" value={addressDetails.street} onChange={handleAddressChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">City</label>
                            <input type="text" name="city" value={addressDetails.city} onChange={handleAddressChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">ZIP Code</label>
                            <input type="text" name="zip" value={addressDetails.zip} onChange={handleAddressChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                           &larr; Back
                        </button>
                        <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                            Complete Signup
                        </button>
                    </div>
                </form>
            )}

        </div>
    );
};

export default SignupPage;