import { CandidateWorkHistory } from "@/models/candidate-work-history";
import { ChevronRight, ChevronRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function Assignment({ history }: { history: CandidateWorkHistory }) {
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        router.prefetch("/assignment/[id]");
    }, []);
    
    return (
        <div onClick={() => router.push('/assignment/' + history.id)} className="cursor-pointer w-full p-4 bg-white rounded-lg shadow flex-col justify-start items-start gap-2.5 inline-flex mb-4">
            <div className="self-stretch justify-start items-center gap-3 inline-flex">
                <div className="grow shrink basis-0 h-12 justify-start items-start gap-3 flex">
                    { history.company.company_logo && <div className="w-12 h-12 relative">
                        <div className="w-12 h-12 left-0 top-0 absolute bg-[#f4f6ff] rounded-xl"></div>
                        <img className="w-8 h-8 left-[8px] top-[8px] absolute rounded-[44px]" 
                            src={process.env.NEXT_PUBLIC_CLOUDINARY_URL + history.company.company_logo }
                            onError={(e) => { history.company.company_logo = null; }} /> 
                    </div> }

                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                        { history.store && <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">
                            { history.store.store_name }</div> }
                        <div className="self-stretch text-[#3f5dca] text-sm font-medium leading-tight">{history.company.company_name}</div>
                    </div>
                </div>
                <ChevronRight className="w-6 h-6 relative origin-top-left stroke-[#7d7d8d]" />
            </div>
        </div>
    );
}