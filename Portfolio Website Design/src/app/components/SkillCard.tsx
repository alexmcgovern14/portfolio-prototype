interface SkillCardProps {
  title: string;
  description: string;
}

export function SkillCard({
  title,
  description
}: SkillCardProps) {
  return (
    <div 
      className="bg-gradient-to-b from-[#6C696A] to-[#4B4744] rounded-xl p-6 shadow-xl hover:opacity-90 transition-opacity duration-300 border-2 border-white/30"
    >
      <h3 className="text-xl font-['Geist:Bold',sans-serif] text-white mb-3">
        {title}
      </h3>
      <p className="text-[#c2c2c2] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}