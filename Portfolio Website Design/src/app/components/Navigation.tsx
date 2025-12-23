import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import linkedinLogo from 'figma:asset/5c61d28ae9cf4a84dc84ff7a5804e018486959ba.png';

export function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="hidden lg:flex fixed left-0 top-0 h-screen z-50 flex-col items-center gap-[50px] bg-[rgba(0,0,0,0)] px-[20px] py-[65px]">
      {/* Social Icons */}
      <div className="flex flex-col gap-[25px]">
        <a
          href="https://uk.linkedin.com/in/alex-mcgovern-531a6576"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8b8b8b] hover:bg-[#0077b5] transition-colors size-[40px] flex items-center justify-center rounded-lg"
          aria-label="LinkedIn"
        >
          <img 
            src={linkedinLogo} 
            alt="LinkedIn" 
            className="size-5"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </a>
        <a
          href="https://github.com/alexmcgovern14"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8b8b8b] hover:bg-[#333] transition-colors size-[40px] flex items-center justify-center rounded-lg"
          aria-label="GitHub"
        >
          <Github className="size-5 text-white" strokeWidth={2} />
        </a>
        <a
          href="https://www.etsy.com/uk/shop/AlexMcGovernDesign"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#8b8b8b] hover:bg-[#f16521] transition-colors size-[40px] flex items-center justify-center rounded-lg"
          aria-label="Etsy"
        >
          <span className="text-white text-2xl font-serif">E</span>
        </a>
      </div>

      {/* Scroll Progress Line and Indicator */}
      <div className="relative h-[calc(100vh-300px)] w-[2px]">
        {/* Vertical Line with arrow at the end */}
        <svg 
          className="absolute inset-0 w-[12px] h-full left-1/2 -translate-x-1/2"
          style={{ height: 'calc(100% + 16px)' }}
          viewBox="0 0 12 100"
          preserveAspectRatio="none"
        >
          {/* Main vertical line - stretches to fill height */}
          <line 
            x1="6" 
            y1="0" 
            x2="6" 
            y2="100" 
            stroke="rgba(196,196,196,0.8)" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        
        {/* Arrow at the very bottom of the line */}
        <svg 
          className="absolute left-1/2 -translate-x-1/2 w-5 h-5"
          style={{ bottom: '-20px' }}
          viewBox="0 0 20 20"
          fill="none"
        >
          <line x1="10" y1="20" x2="4" y2="14" stroke="rgba(196,196,196,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="20" x2="16" y2="14" stroke="rgba(196,196,196,0.8)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        
        {/* Moving Circle */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 size-3 bg-[#c4c4c4] rounded-full transition-all duration-200 ease-out z-10 border-2 border-white/50"
          style={{ top: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}