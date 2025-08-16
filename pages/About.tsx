import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-secondary mb-6">Our Story</h1>
        <p className="text-lg text-center text-secondary-light mb-12">From the looms of Komarapalayam to your wardrobe.</p>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-w-4 aspect-h-3">
                <img src="https://picsum.photos/seed/about/600/450" alt="Loom in Komarapalayam" className="object-cover w-full h-full"/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">The Heritage of Komarapalayam</h2>
                <p className="text-secondary-light leading-relaxed">
                    Nestled on the banks of the Kaveri river, Komarapalayam is a town renowned for its vibrant textile industry. For generations, weavers in this town have perfected the art of creating high-quality lungis, dhotis, and towels. The rhythmic clatter of looms is the heartbeat of our town, a sound that signifies a legacy of craftsmanship passed down through families.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="md:order-2">
                 <div className="aspect-w-4 aspect-h-3">
                    <img src="https://picsum.photos/seed/about2/600/450" alt="Colorful textiles" className="object-cover w-full h-full"/>
                 </div>
            </div>
            <div className="md:order-1">
                <h2 className="text-2xl font-bold text-secondary mb-4">LungiMart.in's Mission</h2>
                <p className="text-secondary-light leading-relaxed mb-4">
                   LungiMart.in was born from a desire to bring this rich heritage to the world. We work directly with local weavers, ensuring they receive fair prices for their incredible skill. Our mission is to bridge the gap between traditional artisans and modern consumers, making authentic, high-quality traditional wear accessible to everyone.
                </p>
                <p className="text-secondary-light leading-relaxed">
                    Every product you purchase from us supports a local weaver and helps keep this beautiful tradition alive. We stand for quality, comfort, and culture.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;