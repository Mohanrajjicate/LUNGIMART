
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Our Story</h1>
        <p className="text-lg text-center text-secondary mb-12">Crafting elegance, one stitch at a time.</p>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" alt="Our team" className="object-cover w-full h-full"/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-primary mb-4">The Heritage of SilkStitch</h2>
                <p className="text-secondary leading-relaxed">
                    Founded on the principles of quality craftsmanship and timeless design, SilkStitch is more than just a brand; it's a legacy. We believe that clothing is a form of self-expression, and our collections are designed to empower individuals to feel confident and elegant every day.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="md:order-2 rounded-lg overflow-hidden">
                 <div className="aspect-w-4 aspect-h-3">
                    <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784&auto=format&fit=crop" alt="Design process" className="object-cover w-full h-full"/>
                 </div>
            </div>
            <div className="md:order-1">
                <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-secondary leading-relaxed mb-4">
                   Our mission is to blend classic styles with contemporary fashion, creating pieces that are both sophisticated and wearable. We source the finest materials and partner with skilled artisans to ensure every garment meets our exacting standards of quality.
                </p>
                <p className="text-secondary leading-relaxed">
                    Every piece you purchase from SilkStitch is an investment in sustainable fashion and supports a community of craftsmen dedicated to their art.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;