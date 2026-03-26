import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 inline-block px-4 py-1.5 rounded-full">
            Effective Date: March 26, 2026
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-12">

          {/* Intro */}
          <section>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Welcome to the personal portfolio and algorithmic tools platform of <span className="font-bold text-blue-600 dark:text-blue-400">Rahim Saroar Mishu</span> (accessible at rahim-saroar.vercel.app). This Privacy Policy explains how information is collected, used, and protected when you visit this website or interact with my personal tools, including the "Forex Rahim" Telegram bot.
            </p>
          </section>

          {/* Grid Sections */}
          <div className="grid gap-10 md:grid-cols-2">
            
            <Section title="1. Information We Collect" icon="📝">
              <ul className="pl-5 space-y-2 text-gray-600 list-disc dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Account Information:</strong> Basic profile info securely provided by authentication services for premium sign-in.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Usage & Performance Data:</strong> Anonymous performance metrics and system status logs to optimize speed.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Cookies & Local State:</strong> Local storage is used to remember preferences like Dark/Light mode.</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Data" icon="⚙️">
               <ul className="pl-5 space-y-2 text-gray-600 list-disc dark:text-gray-400">
                <li>To maintain and improve website performance.</li>
                <li>To manage secure user authentication and sessions.</li>
                <li>To respond to queries submitted via contact forms.</li>
              </ul>
            </Section>

            <Section title="3. Third-Party Services" icon="🔗">
              <ul className="pl-5 space-y-2 text-gray-600 list-disc dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Firebase:</strong> Used for backend database and secure authentication.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Vercel:</strong> Used for website hosting and deployment analytics.</li>
              </ul>
            </Section>

            <Section title="4. Telegram Bot (Forex Rahim)" icon="🤖">
              <ul className="pl-5 space-y-2 text-gray-600 list-disc dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">No Public Data Collection:</strong> The Ultimate Bot V9.0 does not collect or process public user data.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Operation:</strong> It operates strictly as a private automated execution engine linked to the Admin's MT5 account.</li>
              </ul>
            </Section>

          </div>

          {/* Highlighted Security Section */}
          <section className="p-6 border border-blue-100 bg-blue-50 dark:bg-blue-900/10 rounded-2xl md:p-8 dark:border-blue-800/30">
            <h2 className="flex items-center gap-3 mb-3 text-xl font-bold text-blue-800 dark:text-blue-400">
              <span className="text-2xl">🛡️</span> 5. Security
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              We take security seriously and implement standard protocols to protect any data handled by this site. However, please remember that no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="flex items-center gap-3 pb-3 mb-4 text-2xl font-bold border-b border-gray-200 dark:border-gray-800">
              <span className="text-2xl">📬</span> 6. Contact Us
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-400">
              If you have any questions or suggestions about this Privacy Policy, do not hesitate to contact me through the Contact section on this website.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="flex flex-col space-y-4">
    <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
      <span className="p-2 text-2xl bg-gray-100 rounded-lg dark:bg-gray-800">{icon}</span> 
      {title}
    </h2>
    <div className="text-base leading-relaxed">
      {children}
    </div>
  </div>
);

export default PrivacyPage;