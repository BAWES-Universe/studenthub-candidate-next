export function Assignment() {
    return (
        <div className="w-full h-20 p-4 bg-white rounded-lg shadow flex-col justify-start items-start gap-2.5 inline-flex">
    <div className="self-stretch justify-start items-center gap-3 inline-flex">
        <div className="grow shrink basis-0 h-12 justify-start items-start gap-3 flex">
            <div className="w-12 h-12 relative">
                <div className="w-12 h-12 left-0 top-0 absolute bg-[#f4f6ff] rounded-xl"></div>
                <img className="w-8 h-8 left-[8px] top-[8px] absolute rounded-[44px]" src="https://via.placeholder.com/32x32" />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="self-stretch text-[#22223d] text-base font-semibold font-['Inter'] leading-normal">Underline Mishref Booth</div>
                <div className="self-stretch text-[#3f5dca] text-sm font-medium font-['Inter'] leading-tight">Al-Yousr International</div>
            </div>
        </div>
        <div className="w-6 h-6 relative origin-top-left rotate-90"></div>
    </div>
</div>
    );
}