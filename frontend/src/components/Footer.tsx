import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-emerald-900/40" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-bold mb-2">NEHRA JI TECHNICAL</p>
        <p className="text-emerald-200/80 text-sm">© {new Date().getFullYear()} Nehra Ji Technical. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="mailto:SK.NEHRA2005@GMAIL.COM" className="text-emerald-200/80 hover:text-white transition-colors">
            SK.NEHRA2005@GMAIL.COM
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
