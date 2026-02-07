import React from 'react';

const Footer: React.FC = () => {
  return (
    // পরিবর্তন: bg-slate-950 -> bg-black এবং border-slate-900 -> border-zinc-900
    <footer className="py-8 text-white bg-black border-t border-zinc-900">
      <div className="container px-4 mx-auto text-center md:px-8">
        <p className="text-sm text-slate-500">
          © 2026 Rahim Saroar Mishu. Made with ❤️ and React. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;