export default function OnboardNav() {
    return (
        <div className="inline-flex h-8 justify-center items-center gap-1 shrink-0 border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-10,#FAFAFA)] px-2 py-0 rounded-lg border-solid">
            <button className="border-e border-e-[#EEEEF0] ">
                <img src="/assets/icons/up-arrow.svg" className="disabled:fill-[#EEEEF0]" />
            </button>
            <button disabled>
                <img src="/assets/icons/down-arrow.svg" className="disabled:fill-[#EEEEF0]" />
            </button>
        </div>
    )
}