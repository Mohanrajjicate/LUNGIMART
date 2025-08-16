import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Our Story</h1>
        <p className="text-lg text-center text-secondary mb-12">Weaving tradition into everyday life, from the looms of Komarapalayam.</p>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img src="https://i.imgur.com/3ZIVgAm.jpg" alt="A weaver at a loom" className="object-cover w-full h-full"/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-primary mb-4">The Heritage of LungiMart.in</h2>
                <p className="text-secondary leading-relaxed">
                    LungiMart.in was born from a deep respect for the rich weaving traditions of Komarapalayam, a town renowned for its textile mastery. We are more than just a store; we are a bridge connecting the skilled artisans of our hometown to the world, bringing you authentic, comfortable, and high-quality lungis and dhotis.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="md:order-2 rounded-lg overflow-hidden">
                 <div className="aspect-w-4 aspect-h-3">
                    <img src="https://i.imgur.com/K12aZ0i.jpg" alt="Folded dhotis" className="object-cover w-full h-full"/>
                 </div>
            </div>
            <div className="md:order-1">
                <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-secondary leading-relaxed mb-4">
                   Our mission is to preserve and promote the timeless craft of handloom weaving. We work directly with local weavers, ensuring they receive fair compensation for their incredible skill. We aim to make traditional Indian wear accessible, stylish, and an integral part of modern wardrobes.
                </p>
                <p className="text-secondary leading-relaxed">
                    Every piece you purchase from LungiMart.in is an investment in sustainable livelihoods and helps keep a beautiful cultural heritage alive for generations to come.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;