
import React from 'react';

const ContactInfoItem: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="mt-1 text-slate-600">{children}</div>
        </div>
    </div>
);


const ContactPage: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
        const form = e.target as HTMLFormElement;
        form.reset();
    }

    return (
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Get in Touch</h1>
                <p className="mt-4 text-lg text-slate-600">We'd love to hear from you. Please fill out the form below or use our contact details.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-md">
                {/* Contact Information */}
                <div className="space-y-8">
                    <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                        title="Phone"
                    >
                       <a href="tel:+911234567890" className="hover:text-primary transition-colors">+91 12345 67890</a>
                    </ContactInfoItem>
                    <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        title="Email"
                    >
                        <a href="mailto:contact@lungimart.in" className="hover:text-primary transition-colors">contact@lungimart.in</a>
                    </ContactInfoItem>
                    <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Address"
                    >
                        <p>123 Weaver's Colony,<br/>Komarapalayam, Tamil Nadu,<br/>India, 638183</p>
                    </ContactInfoItem>
                </div>
                {/* Contact Form */}
                <div>
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                            <input type="text" name="subject" id="subject" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                            <textarea name="message" id="message" rows={5} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"></textarea>
                        </div>
                        <div className="text-right">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
