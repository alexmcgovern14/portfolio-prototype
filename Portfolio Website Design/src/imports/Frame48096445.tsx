import imgFrame48096445 from "figma:asset/74f57ed8c4940bdd84f178ed24897d3c7c475fe2.png";

function Frame4() {
  return (
    <div className="backdrop-blur-[2px] backdrop-filter bg-[rgba(255,255,255,0.1)] content-stretch flex items-start overflow-clip p-[10px] relative rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap">Personal project</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex items-start justify-end p-[10px] relative size-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return <div className="basis-0 grow min-h-px min-w-px shrink-0 w-full" />;
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic relative shrink-0 w-full">
      <p className="font-['Instrument_Serif:Regular',sans-serif] relative shrink-0 text-[#9bffa7] text-[36px] text-nowrap">RAG AI system</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[18px] text-white w-[min-content]">Vectorising text data to facilitate semantic search through retrieval-augmented generation</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[24px] size-full" src={imgFrame48096445} />
        <div className="absolute inset-0 rounded-[24px]" style={{ backgroundImage: "linear-gradient(180.096deg, rgba(0, 0, 0, 0) 0.1354%, rgba(0, 0, 0, 0.5) 57.513%), linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)" }} />
      </div>
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start justify-end overflow-clip p-[24px] relative size-full">
          <Frame1 />
          <Frame3 />
          <Frame2 />
        </div>
      </div>
    </div>
  );
}