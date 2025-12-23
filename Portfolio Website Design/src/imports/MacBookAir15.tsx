import svgPaths from "./svg-quy64lmgte";
import imgFrame80 from "figma:asset/6dd7e8a5e3b0c8a7d8144c4acf6fc7ad9189d006.png";

function LinkedInIcon() {
  return <div className="absolute bg-[#8b8b8b] left-0 rounded-[5px] size-[40px] top-0" data-name="LinkedIn icon" />;
}

function GithubIcon() {
  return <div className="absolute bg-[#8b8b8b] left-0 rounded-[5px] size-[40px] top-[65px]" data-name="Github Icon" />;
}

function EtsyIcon() {
  return <div className="absolute bg-[#8b8b8b] left-0 rounded-[5px] size-[40px] top-[130px]" data-name="Etsy icon" />;
}

function SocialIcons() {
  return (
    <div className="h-[170px] relative shrink-0 w-[40px]" data-name="Social icons">
      <LinkedInIcon />
      <GithubIcon />
      <EtsyIcon />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] h-full items-center overflow-clip px-[25px] py-[65px] relative shrink-0">
      <SocialIcons />
      <div className="flex h-[496px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[496px]">
            <div className="absolute inset-[-11.05px_-0.3%_-11.05px_-1.61%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 505.5 22.0919">
                <path d={svgPaths.p25d70400} fill="var(--stroke-0, #8B8B8B)" id="Line 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute left-[33px] size-[263px] top-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[301.13%] left-[-46.38%] max-w-none top-[-50.45%] w-[200.75%]" src={imgFrame80} />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[284.858px] relative shrink-0 w-[339.273px]">
      <Frame />
      <div className="absolute flex h-[42.858px] items-center justify-center left-0 top-[242px] w-[339.273px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[3.291deg]">
          <div className="h-[23.463px] relative w-[338.484px]">
            <div className="absolute inset-[-20.31%_-0.07%_-18.81%_-0.67%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340.999 32.6415">
                <path d={svgPaths.p27936900} fill="url(#paint0_linear_1_31)" id="Vector 6" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_31" x1="2.283" x2="340.767" y1="16.496" y2="16.496">
                    <stop stopColor="#00A3FB" />
                    <stop offset="1" stopColor="#00CBBD" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[329px] leading-[0] relative shrink-0 text-nowrap w-[421px]">
      <p className="absolute font-['Geist:Medium',sans-serif] font-medium leading-[normal] left-[5px] text-[#152630] text-[30px] top-[290px]">
        <span className="bg-clip-text bg-gradient-to-r font-['Geist:Bold',sans-serif] font-bold from-[#00a1ff] to-[#00ff6f]" style={{ WebkitTextFillColor: "transparent" }}>
          AI product
        </span>{" "}
        <span className="text-[#c2c2c2] font-[Inter] font-bold font-normal">manager</span>.
      </p>
      <div className="absolute font-['Instrument_Serif:Regular',sans-serif] leading-[133px] left-0 not-italic text-[#f0eae1] text-[130px] top-0 tracking-[-2px]">
        <p className="mb-0 text-[rgb(255,255,255)]">{`Alex `}</p>
        <p className="text-[rgb(255,255,255)]">McGovern</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 grow h-[832px] min-h-px min-w-px relative shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        {/* Desktop layout - horizontal */}
        <div className="hidden md:flex content-stretch gap-[85px] items-center px-[40px] py-0 relative">
          <Frame3 />
          <Frame2 />
        </div>
        
        {/* Mobile layout - vertical */}
        <div className="flex md:hidden flex-col items-center justify-center gap-8 px-6 py-12">
          {/* Name */}
          <div className="font-['Instrument_Serif:Regular',sans-serif] text-[64px] leading-[1.1] text-center text-white tracking-[-1px]">
            <p className="mb-0">Alex</p>
            <p>McGovern</p>
          </div>
          
          {/* AI product manager */}
          <p className="font-['Geist:Medium',sans-serif] font-medium text-[24px] text-center">
            <span className="bg-clip-text bg-gradient-to-r font-['Geist:Bold',sans-serif] font-bold from-[#00a1ff] to-[#00ff6f]" style={{ WebkitTextFillColor: "transparent" }}>
              AI product
            </span>{" "}
            <span className="text-[#c2c2c2] font-bold">manager</span>.
          </p>
          
          {/* Photo with stroke - using desktop structure */}
          <div className="h-[262px] relative w-[280px]">
            <div className="absolute left-[20px] size-[240px] top-0">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute h-[301.13%] left-[-46.38%] max-w-none top-[-50.45%] w-[200.75%]" src={imgFrame80} />
              </div>
            </div>
            <div className="absolute flex h-[42.858px] items-center justify-center left-0 top-[220px] w-[280px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[3.291deg]">
                <div className="h-[23.463px] relative w-[280px]">
                  <div className="absolute inset-[-20.31%_-0.07%_-18.81%_-0.67%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340.999 32.6415">
                      <path d={svgPaths.p27936900} fill="url(#paint0_linear_mobile)" />
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_mobile" x1="2.283" x2="340.767" y1="16.496" y2="16.496">
                          <stop stopColor="#00A3FB" />
                          <stop offset="1" stopColor="#00CBBD" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="content-stretch flex gap-[105px] items-center relative size-full" data-name="MacBook Air - 15" style={{ backgroundImage: "linear-gradient(125.05deg, rgb(75, 71, 70) 5.0438%, rgb(177, 168, 165) 100%)" }}>
      <Frame4 />
    </div>
  );
}