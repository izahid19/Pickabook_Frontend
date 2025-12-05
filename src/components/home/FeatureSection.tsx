'use client';

export default function FeatureSection() {
  const features = [
    { emoji: '⚡', title: 'Lightning Fast', desc: 'Get your 3D character in under 30 seconds' },
    { emoji: '🎨', title: 'Pixar Quality', desc: 'Professional 3D renders with cinematic lighting' },
    { emoji: '🔒', title: 'Secure & Private', desc: 'Your photos are never stored or shared' },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Pickabook Magic?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="feature-card opacity-0 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
