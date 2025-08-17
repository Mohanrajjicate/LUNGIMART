import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!process.env.API_KEY) {
            setError("API key is not configured.");
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = "You are a friendly and helpful e-commerce assistant for LungiMart.in, a store specializing in traditional Indian wear like lungis and dhotis from Komarapalayam. Your goal is to assist users with their shopping experience. You can answer questions about products, help them find specific items (like 'dhotis for a wedding' or 'comfortable daily wear lungis'), provide information about our materials (Komarapalayam cotton), and explain our store's mission of supporting local weavers. Keep your answers concise, friendly, and focused on helping the user. Do not make up products that don't exist in the store's catalog.";
            
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
        } catch (e) {
            console.error("Failed to initialize GenAI:", e);
            setError("Failed to initialize AI assistant.");
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
     useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'model', text: "Hello! How can I help you find the perfect traditional wear today?" }]);
        }
    }, [isOpen]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (e) {
            console.error("Error sending message:", e);
            setError("Sorry, I'm having trouble connecting. Please try again later.");
            setMessages(prev => [...prev, { role: 'model', text: "Oops! Something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-0 right-0 m-5 sm:m-8 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-transform hover:scale-110"
                    aria-label="Open chat assistant"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 sm:m-8 z-50 w-full h-full sm:h-auto sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 bg-primary/5 rounded-t-xl">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">LungiMart Assistant</h2>
                        <p className="text-xs text-slate-500">Powered by Gemini</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-800" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto h-[calc(100%-140px)] sm:h-96">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                                    </div>
                                )}
                                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-2 justify-start">
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                                </div>
                                <div className="px-4 py-2.5 rounded-2xl bg-slate-100 rounded-bl-none">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about products..."
                            className="w-full px-4 py-2 bg-slate-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;
