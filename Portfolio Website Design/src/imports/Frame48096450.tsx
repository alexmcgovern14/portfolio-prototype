import imgIPhone1415Pro2 from "figma:asset/432e26136edee755465f6e5b561a799820c4bd22.png";
import imgImage18 from "figma:asset/c4678d57f1b7030871579de411ff01beeec565ff.png";
import imgImage17 from "figma:asset/8959137542bd1c530e814fafd123cfb7b574c404.png";

function IPhone1415Pro() {
  return (
    <div className="h-[160px] pointer-events-none relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[90px]" data-name="iPhone 14 & 15 Pro - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={imgIPhone1415Pro2} />
      <div className="absolute inset-0 shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.75),inset_0px_2px_4px_0px_#6c1240]" />
    </div>
  );
}

function IPhone1415Pro1() {
  return (
    <div className="h-[160px] overflow-clip relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[90px]" data-name="iPhone 14 & 15 Pro - 3">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgIPhone1415Pro2} />
      <div className="absolute h-[173px] left-[-12px] top-[-9px] w-[122px]" data-name="image 18">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage18} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.75),inset_0px_2px_4px_0px_#c21c71]" />
    </div>
  );
}

function IPhone1415Pro2() {
  return (
    <div className="h-[160px] overflow-clip relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[90px]" data-name="iPhone 14 & 15 Pro - 4">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgIPhone1415Pro2} />
      <div className="absolute h-[184px] left-[-8px] top-0 w-[130px]" data-name="image 17">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage17} />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.75),inset_0px_2px_4px_0px_#6c1240]" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center p-[25px] relative size-full">
          <IPhone1415Pro />
          <IPhone1415Pro1 />
          <IPhone1415Pro2 />
        </div>
      </div>
    </div>
  );
}