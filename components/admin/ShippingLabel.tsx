import React from 'react';
import { Order, Address } from '../../types';

interface ShippingLabelProps {
    order: Order;
    shippingAddress: Address;
}

const ShippingLabel: React.FC<ShippingLabelProps> = ({ order, shippingAddress }) => {
    // Mock LungiMart address
    const fromAddress = {
        name: "LungiMart.in Dispatch",
        street: "123 Weaver's Colony",
        city: "Komarapalayam, Tamil Nadu",
        zip: "638183",
    };

    return (
        <>
        <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                #shipping-label, #shipping-label * {
                    visibility: visible;
                }
                #shipping-label {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .no-print { display: none !important; }
            }
        `}</style>
        <div id="shipping-label" className="w-[4in] h-[6in] p-4 bg-white border-2 border-dashed border-black font-sans text-black">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-black pb-2">
                    <div>
                        <h1 className="text-xl font-bold">LungiMart.in</h1>
                        <p className="text-xs">Komarapalayam, TN</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg uppercase">{order.paymentMethod}</p>
                        <p className="text-xs">Order: {order.id}</p>
                    </div>
                </div>

                {/* From Address */}
                <div className="py-2 border-b-2 border-black">
                    <p className="text-xs font-bold uppercase">From:</p>
                    <address className="not-italic text-sm">
                        <strong>{fromAddress.name}</strong><br />
                        {fromAddress.street}<br />
                        {fromAddress.city}, {fromAddress.zip}
                    </address>
                </div>

                {/* To Address */}
                <div className="py-4 flex-grow">
                    <p className="text-xs font-bold uppercase">To:</p>
                    <address className="not-italic text-2xl font-bold leading-tight">
                        {shippingAddress.name}<br />
                        {shippingAddress.street}<br />
                        {shippingAddress.city}<br />
                        {shippingAddress.zip}
                    </address>
                </div>
                
                {/* Footer with QR Code and Barcode */}
                <div className="flex justify-between items-end border-t-2 border-black pt-2">
                     <div className="w-24 h-24 p-1 border border-black">
                        {/* Mock QR Code */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path fill="#000" d="M0 0h30v30H0z M70 0h30v30H70z M0 70h30v30H0z M10 10h10v10H10z M80 10h10v10H80z M10 80h10v10H10z M40 0h10v10H40z M60 0h10v10H60z M40 20h10v10H40z M0 40h10v10H0z M20 40h10v10H20z M40 40h10v10H40z M60 40h10v10H60z M80 40h10v10H80z M100 40h-10v10h10z M40 60h10v10H40z M70 60h30v10H70z M0 90h10v10H0z M20 90h10v10H20z M40 90h10v10H40z M70 90h30v10H70z M40 100v-10h10v10z"/>
                        </svg>
                     </div>
                     <div className="text-center">
                        {/* Mock Barcode */}
                        <div className="flex items-end h-10 space-x-px">
                            <div className="w-0.5 bg-black h-full"></div><div className="w-px bg-black h-4/5"></div><div className="w-0.5 bg-black h-full"></div>
                            <div className="w-0.5 bg-black h-full"></div><div className="w-px bg-black h-4/5"></div><div className="w-px bg-black h-full"></div>
                            <div className="w-px bg-black h-2/5"></div><div className="w-0.5 bg-black h-full"></div><div className="w-px bg-black h-4/5"></div>
                            <div className="w-0.5 bg-black h-4/5"></div><div className="w-px bg-black h-full"></div><div className="w-px bg-black h-2/5"></div>
                             <div className="w-0.5 bg-black h-full"></div><div className="w-px bg-black h-4/5"></div><div className="w-0.5 bg-black h-full"></div>
                            <div className="w-px bg-black h-full"></div><div className="w-px bg-black h-2/5"></div><div className="w-0.5 bg-black h-4/5"></div>
                        </div>
                        <p className="text-xs tracking-widest">{order.id}</p>
                     </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ShippingLabel;
