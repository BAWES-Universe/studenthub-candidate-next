import { useTranslation } from "react-i18next";

export function CandidateAction() {
    const { t } = useTranslation();
    
    return (
        <div className="w-full h-[844px] relative bg-[#f7f8fa]">
            <div className="w-[342px] h-[157px] left-[24px] top-[180px] absolute bg-white rounded-lg shadow"></div>
            <div className="left-[159px] top-[204px] absolute text-center text-[#7d7d8d] text-sm font-medium leading-tight">Total Time</div>
            <div className="left-[48px] top-[293px] absolute justify-start items-start gap-1 inline-flex">
                <div className="text-[#22223d] text-sm font-semibold leading-tight">Start Time:</div>
                <div className="text-[#4b4b61] text-sm font-normal leading-tight">9:34 am</div>
            </div>
            <div className="left-[218px] top-[293px] absolute justify-start items-start gap-1 inline-flex">
                <div className="text-[#22223d] text-sm font-semibold leading-tight">End Time:</div>
                <div className="text-[#4b4b61] text-sm font-normal leading-tight">1:37 pm</div>
            </div>
            <div className="left-[149px] top-[232px] absolute text-[#22223d] text-xl font-bold leading-7">04:03:27</div>
            <div className="left-[24px] top-[369px] absolute"><span className="text-[#22223d] text-lg font-semibold leading-7">Sessions </span><span className="text-[#7d7d8d] text-lg font-semibold leading-7">(3)</span></div>
            <div className="w-[310px] h-px left-[40px] top-[276px] absolute bg-[#eeeef0]"></div>
            <div className="w-[342px] p-4 left-[24px] top-[413px] absolute bg-white rounded-lg shadow justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-14 justify-start items-center gap-4 flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                        <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">01:27:46</div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">9:34 am</div>
                            <div className="w-6 h-6 relative">
                                <div className="w-6 h-6 left-0 top-0 absolute opacity-0 bg-white"></div>
                            </div>
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">11:02 am</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[342px] p-4 left-[24px] top-[517px] absolute bg-white rounded-lg shadow justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-14 justify-start items-center gap-4 flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                        <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">00:54:16</div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">11:17 am</div>
                            <div className="w-6 h-6 relative">
                                <div className="w-6 h-6 left-0 top-0 absolute opacity-0 bg-white"></div>
                            </div>
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">12:10 pm</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[342px] p-4 left-[24px] top-[617px] absolute bg-white rounded-lg shadow justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-14 justify-start items-center gap-4 flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                        <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">00:54:16</div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">12:23 am</div>
                            <div className="w-6 h-6 relative">
                                <div className="w-6 h-6 left-0 top-0 absolute opacity-0 bg-white"></div>
                            </div>
                            <div className="text-[#4b4b61] text-sm font-normal leading-tight">1:37 pm</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="left-0 top-0 absolute bg-white shadow flex-col justify-start items-start inline-flex">
                <div className="self-stretch h-11 p-2.5 bg-white"></div>
                <div className="self-stretch h-28 px-6 pt-2 pb-4 bg-white flex-col justify-start items-start gap-4 flex">
                    <div className="self-stretch justify-start items-center gap-[286px] inline-flex">
                        <div className="w-10 h-10 p-2 bg-[#f5f5f7] rounded-[20px] flex-col justify-start items-start gap-2.5 inline-flex">
                            <div className="w-6 h-6 relative origin-top-left -rotate-180"></div>
                        </div>
                        <div className="w-8 h-8 relative">
                            <div className="w-8 h-8 left-0 top-0 absolute opacity-0 bg-white"></div>
                            <div className="w-1 h-1 left-[14px] top-[6px] absolute bg-[#a4a4af] rounded-full"></div>
                            <div className="w-1 h-1 left-[14px] top-[14px] absolute bg-[#a4a4af] rounded-full"></div>
                            <div className="w-1 h-1 left-[14px] top-[22px] absolute bg-[#a4a4af] rounded-full"></div>
                        </div>
                    </div>
                    <div className="self-stretch justify-start items-start gap-4 inline-flex">
                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                            <div className="text-[#22223d] text-2xl font-bold leading-loose">Thu, 3 Jun</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 