export default function Frame() {
  return (
    <div className="backdrop-blur-[2px] backdrop-filter bg-[rgba(255,255,255,0.2)] relative rounded-[100px] size-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center overflow-clip px-[8px] py-[4px] relative size-full">
          <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white">Personal project</p>
        </div>
      </div>
      <div className="absolute inset-[-0.25px] pointer-events-none shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.1)]" />
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.75)] border-solid inset-[-0.25px] pointer-events-none rounded-[100.25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}