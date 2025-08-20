
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const QuietZonePage: React.FC = () => {
  const { isQuietZoneActive, toggleQuietZone } = useAppContext();

  return (
    <div className="flex justify-center items-start py-12 md:py-20">
      <div className={`w-full max-w-2xl text-center p-8 rounded-xl shadow-md transition-colors duration-500 bg-white text-slate-800`}>
        
        {isQuietZoneActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-20 w-20 mb-6 transition-all duration-500 transform text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 mb-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        )}
        
        <h1 className={`text-4xl font-extrabold tracking-tight text-slate-900`}>
            Quiet Zone
        </h1>
        
        <p className={`mt-4 max-w-md mx-auto text-lg text-slate-600`}>
          {isQuietZoneActive
            ? "You're in the Quiet Zone. All app notifications are currently silenced."
            : "Toggle to enter the Quiet Zone and silence all app notifications."}
        </p>
        
        <div className="mt-10 flex justify-center">
            <button
                onClick={toggleQuietZone}
                className={`relative inline-flex items-center h-10 rounded-full w-20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isQuietZoneActive ? 'bg-primary focus:ring-primary' : 'bg-slate-200 focus:ring-primary'}`}
                role="switch"
                aria-checked={isQuietZoneActive}
            >
                <span className="sr-only">Toggle Quiet Zone</span>
                <span
                    className={`inline-block w-8 h-8 transform bg-white rounded-full transition-transform duration-300 ${isQuietZoneActive ? 'translate-x-11' : 'translate-x-1'}`}
                />
            </button>
        </div>
        
        <p className={`mt-8 text-sm font-semibold transition-colors duration-500 ${isQuietZoneActive ? 'text-primary' : 'text-slate-500'}`}>
            Status: {isQuietZoneActive ? 'ACTIVE' : 'INACTIVE'}
        </p>
      </div>
    </div>
  );
};

export default QuietZonePage;
