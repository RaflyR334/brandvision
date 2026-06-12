
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-6 border-b border-slate-700">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        BrandVision AI
      </h1>
      <p className="mt-2 text-slate-400 text-lg">Define Your Professional Identity</p>
    </header>
  );
};

export default Header;
