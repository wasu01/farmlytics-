import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-lime-50 to-yellow-50 px-4 py-16">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-green-200">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4 text-center">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
          We are <span className="font-semibold text-green-800">The Farmer's Stand</span>, a mission-driven platform revolutionizing how food moves from the farm to your table. We partner with government bodies to create secure, verified market spaces that empower farmers to completely bypass the middleman. Our app provides every farmer with a secure <span className="font-semibold text-green-800">Farmlytics ID</span> for guaranteed access, coupled with smart tools like the <span className="font-semibold text-green-800">Saathi AI</span> and live pricing to boost their yield and their earnings. We're here to guarantee farmers higher profits and give consumers the freshest produce—all through a trustworthy, efficient, and transparent digital system.
        </p>
        <div className="flex justify-center mt-8">
          <img src="/assets/about-farming.svg" alt="Farming" className="w-48 h-48 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
