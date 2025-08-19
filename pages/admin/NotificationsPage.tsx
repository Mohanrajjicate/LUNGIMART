import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const NotificationsPage: React.FC = () => {
    const { sendGlobalNotification } = useAppContext();
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }
        sendGlobalNotification(message, link); 
        
        setStatus('success');
        setMessage('');
        setLink('');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Push Notifications</h2>
            <p className="text-sm text-slate-500 mb-6">Send a notification to all registered customers. It will appear in their notification bell on their next visit.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        required
                        className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                        placeholder="e.g., Flash Sale! 50% off on all dhotis this weekend."
                    />
                </div>
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-slate-700">Optional Link</label>
                    <input
                        id="link"
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                        placeholder="e.g., /shop/dhoti"
                    />
                     <p className="mt-1 text-xs text-slate-500">Internal link, e.g., `/shop/best-selling`.</p>
                </div>
                <div className="flex justify-end items-center gap-4">
                    {status === 'success' && <p className="text-sm font-semibold text-green-600">Notification sent successfully!</p>}
                    {status === 'error' && <p className="text-sm font-semibold text-red-600">Message cannot be empty.</p>}
                    <button
                        type="submit"
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Send Notification
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationsPage;
