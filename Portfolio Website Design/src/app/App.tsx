import { Navigation } from './components/Navigation';
import { ProjectCard } from './components/ProjectCard';
import { SkillCard } from './components/SkillCard';
import { AboutMeLayout1 } from './components/AboutMeLayout1';
import { AboutMeLayout2 } from './components/AboutMeLayout2';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectDetail } from './components/ProjectDetailNew';
import { Toaster } from 'sonner';
import { Github } from 'lucide-react';
import MacBookAir from '../imports/MacBookAir15';
import behanceLogo from 'figma:asset/ab051b3dbc5f6e7836893dc943f2b4ba9e0379e6.png';
import linkedinLogo from 'figma:asset/5c61d28ae9cf4a84dc84ff7a5804e018486959ba.png';
import newPainting1 from 'figma:asset/3cd283705607eec6b6aafcd1a141060ce7041e1b.png';
import newPainting2 from 'figma:asset/78b8b27c1bda2b94f03fa3dc7e0eb9c8e3f83bc2.png';
import newPainting3 from 'figma:asset/0245a13d54cbb22af59e06387b513ffe4a8ded6f.png';
import newPainting4 from 'figma:asset/ba4cf97ab6a79707d29eafdf97cf8f0eb8e8d454.png';
import newPainting5 from 'figma:asset/05638db4c7f687001e3b661a01b85f85d2615a84.png';
import profilePhoto from 'figma:asset/f63ac239d90f0351e1ad01c4a167ab53c9b1b2c1.png';
import beyondProductPhoto from 'figma:asset/b82f3fe63941c182cb0917cb0aae4da5b7fb9718.png';
import Slider from 'react-slick';
import ragWorkflowImg from 'figma:asset/1ad9a175c9c9c9a0ec903e169c7782ddaf937831.png';
import ragProjectImg from 'figma:asset/74f57ed8c4940bdd84f178ed24897d3c7c475fe2.png';
import liveMatchImg from 'figma:asset/e6c6e387a5ae6c02f2326f483ef3716f22548a1a.png';
import artistRecommendationImg from 'figma:asset/e6d257b084bd5c237a191cbdaae905a08a859319.png';
import lineupChangesImg from 'figma:asset/fc4929f386849887f0b522845ad0eeb4643222ec.png';
import thisWebsiteImg from 'figma:asset/edc41436bf0b124f28a053a15d04921e43d086a5.png';

function HomePage() {
  const projects = [
    {
      title: "Knowledge: RAG AI system",
      titleParts: [
        { text: "Knowledge:", gradient: true },
        { text: " RAG AI system", gradient: false }
      ],
      description: "LLM semantic search through vectorised data",
      category: "Personal project",
      imageUrl: ragWorkflowImg,
      slug: "rag-ai-system"
    },
    {
      title: "Data-led live match updates",
      titleParts: [
        { text: "Data-led ", gradient: false },
        { text: "live match", gradient: true },
        { text: " updates", gradient: false }
      ],
      description: "GenAI in-play update on what's happening in a football match",
      category: "LiveScore feature",
      imageUrl: liveMatchImg,
      slug: "live-match-summary"
    },
    {
      title: "Feature: Line-up changes",
      titleParts: [
        { text: "Feature: ", gradient: false },
        { text: "Line-up changes", gradient: true }
      ],
      description: "Case study in recognising model limitations and building effective systems",
      category: "LiveScore feature",
      imageUrl: lineupChangesImg,
      slug: "lineup-changes"
    },
    {
      title: "Spotify recommendation engine",
      titleParts: [
        { text: "Spotify ", gradient: false },
        { text: "recommendation", gradient: true },
        { text: " engine", gradient: false }
      ],
      description: "Builds personalised playlists based on listening history",
      category: "Personal project",
      imageUrl: artistRecommendationImg,
      slug: "spotify-recommendation-engine"
    },
    {
      title: "This website: Full stack",
      titleParts: [
        { text: "This website: ", gradient: false },
        { text: "Full stack", gradient: true }
      ],
      description: "Design, development and deployment of portfolio website, across multiple tools",
      category: "Product Strategy",
      imageUrl: thisWebsiteImg,
      slug: "e-commerce-platform"
    }
  ];

  const skills = [
    {
      title: "Product Strategy & Vision",
      description: "Expert in defining product vision, creating roadmaps, and aligning stakeholders around long-term strategic goals."
    },
    {
      title: "User-Centered Design",
      description: "Passionate about understanding user needs through research, testing, and iterative design processes."
    },
    {
      title: "Data-Driven Decision Making",
      description: "Proficient in leveraging analytics, A/B testing, and metrics to inform product decisions and measure success."
    },
    {
      title: "Cross-Functional Leadership",
      description: "Skilled at leading diverse teams of engineers, designers, and stakeholders to deliver impactful products."
    },
    {
      title: "Agile & Scrum",
      description: "Experienced in agile methodologies, sprint planning, and continuous delivery practices."
    },
    {
      title: "Technical Fluency",
      description: "Strong technical understanding enabling effective communication with engineering teams and technical stakeholders."
    }
  ];

  // Skills data for About Me section
  const aboutMeSkills = [
    {
      title: "Building with AI",
      description: "Integrating LLMs into user-facing products; defining data input, evals, guardrails, observability."
    },
    {
      title: "0 → 1",
      description: "Full-stack proof of concepts to develop ideas, validate feasibility and design systems."
    },
    {
      title: "Product leadership",
      description: "Leading AI strategy and execution, driving adoption and upskilling."
    },
    {
      title: "Internal systems",
      description: "Delivering internal tooling, agents, platforms, workflows and standards."
    }
  ];

  const paintings = [
    newPainting1,
    newPainting2,
    newPainting3,
    newPainting4,
    newPainting5
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '240px',
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: '60px',
        }
      }
    ],
    beforeChange: (current: number, next: number) => {},
    customPaging: (i: number) => (
      <button className="w-2 h-2 rounded-full bg-[rgb(7,15,34)] hover:bg-white transition-all duration-300" />
    ),
    dotsClass: "slick-dots !flex !gap-1 !justify-center",
  };

  return (
    <div className="relative min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="h-screen w-full">
        <MacBookAir />
      </section>

      {/* Projects Section */}
      <section className="min-h-screen py-10 md:py-20 px-4 md:px-8 lg:px-32 bg-[#5a5452]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-4xl md:text-6xl text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-[#c2c2c2] mb-8 md:mb-16 font-[ABeeZee] text-base md:text-xl leading-relaxed">
            Selection of features in production at LiveScore and personal projects. Mostly featuring LLMs in product or built in AI-native process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section - Layout 1: Photo on left, 4 skill cards on right */}
      {/* To switch to Layout 2, replace <AboutMeLayout1 /> with <AboutMeLayout2 /> */}
      <AboutMeLayout2 skills={aboutMeSkills} />

      {/* Digital Art Section */}
      <section className="min-h-screen w-full bg-[#6d6765] py-10 md:py-20 px-4 md:px-8 lg:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-4xl md:text-6xl text-white mb-4">
            Digital art
          </h2>
          <p className="text-[#c2c2c2] mb-8 md:mb-16 font-[ABeeZee] text-base md:text-xl leading-relaxed">
            Design and creative background influence product thinking.
          </p>

          {/* Paintings Section */}
          <div className="mb-20">
            <a 
              href="https://www.etsy.com/uk/shop/AlexMcGovernDesign" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 mb-10 group"
            >
              <div className="bg-[#8b8b8b] group-hover:bg-[#f16521] transition-colors size-[40px] flex items-center justify-center rounded-lg flex-shrink-0">
                <span className="text-white font-serif">E</span>
              </div>
              <p className="text-[#c2c2c2] font-[ABeeZee] text-base md:text-xl leading-relaxed group-hover:text-white transition-colors">
                <strong className="text-white">Paintings</strong> available on Etsy
              </p>
            </a>
            
            {/* Paintings Carousel */}
            <div className="pb-16 overflow-visible">
              <style>{`
                .paintings-carousel .slick-list {
                  overflow: visible !important;
                }
                .paintings-carousel .slick-track {
                  display: flex !important;
                  align-items: center;
                }
                .paintings-carousel .slick-slide {
                  opacity: 0.5;
                  transition: opacity 0.3s ease, transform 0.3s ease;
                  transform: scale(0.85);
                }
                .paintings-carousel .slick-slide.slick-active {
                  opacity: 1;
                  transform: scale(1);
                }
                .paintings-carousel .slick-dots li button {
                  background-color: #6b7280;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  padding: 0;
                  border: none;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                .paintings-carousel .slick-dots li button:hover {
                  background-color: #9ca3af;
                }
                .paintings-carousel .slick-dots li.slick-active button {
                  background-color: #ffffff;
                  width: 10px;
                  height: 10px;
                }
                .paintings-carousel .slick-dots {
                  display: flex !important;
                  gap: 4px;
                  justify-content: center;
                  list-style: none;
                  padding: 0;
                  margin-top: 40px;
                }
                .paintings-carousel .slick-dots li {
                  margin: 0;
                  padding: 0;
                  width: auto;
                  height: auto;
                }
              `}</style>
              <div className="paintings-carousel">
                <Slider {...carouselSettings}>
                  {paintings.map((painting, index) => (
                    <div key={index}>
                      <div className="flex justify-center" style={{ margin: '0 15px' }}>
                        <img 
                          src={painting} 
                          alt={`Digital painting ${index + 1}`}
                          className="w-[480px] h-[480px] object-cover rounded-2xl shadow-2xl border-2 border-white/30"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>

          {/* Motion Designer Section */}
          <div>
            <a 
              href="https://www.behance.net/alex-mcgovern" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 mb-10 group"
            >
              <div className="bg-[#8b8b8b] group-hover:bg-[#1769ff] transition-colors size-[40px] flex items-center justify-center rounded-lg flex-shrink-0">
                <img 
                  src={behanceLogo} 
                  alt="Behance"
                  className="size-6"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <p className="text-[#c2c2c2] font-[ABeeZee] text-base md:text-xl leading-relaxed group-hover:text-white transition-colors">
                Former <strong className="text-white">motion designer</strong> and content <strong className="text-white">strategy & production manager</strong>
              </p>
            </a>
            
            {/* Embeds Grid */}
            <div className="grid grid-cols-1 gap-8">
              {/* Behance and Instagram Row */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Behance embed - left, wider */}
                <div className="flex-1 flex justify-center items-start w-full">
                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-900 w-full border-2 border-white/30" style={{ maxWidth: '700px' }}>
                    <iframe 
                      src="https://www.behance.net/embed/project/151280181?ilo0=1" 
                      width="100%"
                      height="550"
                      allowFullScreen 
                      loading="lazy" 
                      frameBorder="0" 
                      allow="clipboard-write" 
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>

                {/* Instagram embed - right, smaller */}
                <div className="flex-shrink-0 flex justify-center items-start w-full md:w-auto">
                  <div className="rounded-2xl overflow-hidden shadow-2xl w-full md:w-[380px] border-2 border-white/30">
                    <iframe
                      src="https://www.instagram.com/p/CEzAI5JgMJZ/embed/"
                      width="380"
                      height="550"
                      frameBorder="0"
                      scrolling="no"
                      allowtransparency="true"
                      style={{ 
                        border: 'none', 
                        overflow: 'hidden',
                        width: '100%',
                        minHeight: '550px'
                      }}
                      title="Instagram post by @amgdgn"
                    />
                  </div>
                </div>
              </div>

              {/* YouTube embed - below, matching width of row above */}
              {/* <div className="flex gap-8">
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/QsS2fF0MdEg?si=2d9516PoiFlqTwuy" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Product Section */}
      <section className="min-h-screen w-full bg-[#5a5452] py-10 md:py-20 px-4 md:px-8 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            {/* Left side - Text and Spotify */}
            <div className="flex-1 w-full">
              <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-4xl md:text-6xl text-white mb-4">
                Beyond product
              </h2>
              <p className="text-[#c2c2c2] mb-8 md:mb-16 font-[ABeeZee] text-base md:text-xl leading-relaxed">
                Creative pursuits, vibe coding, politics, history, culture, football and music — from rock, country and blues to hip-hop and soul.
              </p>
              
              <p className="text-[#c2c2c2] mb-6 font-[ABeeZee]">
                Currently listening to:
              </p>
              
              {/* Spotify Embed */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
                <iframe 
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1Epy0FHcD7AQ0o?utm_source=generator&theme=0" 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            
            {/* Right side - Photo */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
              <img 
                src={beyondProductPhoto} 
                alt="Alex McGovern" 
                className="w-full max-w-[300px] lg:w-[300px] h-auto object-contain rounded-2xl shadow-2xl border-2 border-white/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4a4442] py-8 md:py-16 px-4 md:px-8 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {/* LinkedIn */}
            <a
              href="https://uk.linkedin.com/in/alex-mcgovern-531a6576"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-12 md:size-14 bg-[#8b8b8b] hover:bg-[#0077b5] transition-colors rounded-lg group"
              aria-label="LinkedIn"
            >
              <img 
                src={linkedinLogo} 
                alt="LinkedIn"
                className="size-5 md:size-6"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-12 md:size-14 bg-[#8b8b8b] hover:bg-[#333] transition-colors rounded-lg group"
              aria-label="GitHub"
            >
              <Github className="size-5 md:size-6 text-white" />
            </a>

            {/* Etsy */}
            <a
              href="https://www.etsy.com/uk/shop/AlexMcGovernDesign"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-12 md:size-14 bg-[#8b8b8b] hover:bg-[#f16521] transition-colors rounded-lg group"
              aria-label="Etsy"
            >
              <span className="text-white text-xl md:text-2xl font-serif">E</span>
            </a>

            {/* Behance */}
            <a
              href="https://www.behance.net/alex-mcgovern"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-12 md:size-14 bg-[#8b8b8b] hover:bg-[#1769ff] transition-colors rounded-lg group"
              aria-label="Behance"
            >
              <img 
                src={behanceLogo} 
                alt="Behance"
                className="size-5 md:size-6"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          </div>
          
          {/* Credit */}
          <p className="text-[#c2c2c2] text-center mt-6 md:mt-8 font-[ABeeZee] text-sm md:text-base">
            Updated: Dec. 2025 | Designed and built by Alex McGovern
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
      <Toaster />
    </Router>
  );
}