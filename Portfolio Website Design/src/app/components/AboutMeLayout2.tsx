import { SkillCard } from './SkillCard';
import speakingPhoto from 'figma:asset/cd4d8a7e0af8ec1d891cf525a50981ef1d4a3940.png';

interface AboutMeLayout2Props {
  skills: Array<{
    title: string;
    description: string;
  }>;
}

export function AboutMeLayout2({ skills }: AboutMeLayout2Props) {
  // Use first 4 skills for this layout
  const displaySkills = skills.slice(0, 4);

  return (
    <section className="min-h-screen py-10 md:py-20 px-4 md:px-8 lg:px-32 bg-[#7a7573]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-4xl md:text-6xl text-white mb-4">
          AI product management
        </h2>
        <p className="text-[#c2c2c2] mb-8 md:mb-16 font-[ABeeZee] text-base md:text-xl leading-relaxed">
          Leading AI product development from concept to shipping
        </p>
        
        {/* Layout 2: 4 skill cards on top, large photo below */}
        <div className="space-y-8">
          {/* 4 Skills on Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displaySkills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
          
          {/* Large Photo Below */}
          <div 
            className="overflow-hidden rounded-xl shadow-xl border-2 border-white/30"
          >
            <img 
              src={speakingPhoto}
              alt="Speaking at an event"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}