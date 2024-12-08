import { CandidateWorkHistory } from "@/models/candidate-work-history";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export function WorkHistoryComponent({ history }: { history: CandidateWorkHistory }) {
    const { t } = useTranslation();

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex  mb-4">
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch text-[#0f0f2c] text-base font-semibold leading-normal">
                    {history.company.company_name}
                </div>
                <div className="self-stretch h-5 justify-start items-center gap-4 inline-flex">
                    { history.store && <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-normal leading-tight">
                        { history.store.store_name }
                    </div> }
                    <div className="grow shrink basis-0 text-right text-[#4b4b61] text-xs font-normal leading-none">
                    {format(history.start_date || '', 'MMM. yyyy')} - { history.end_date? format(history.end_date, 'MMM. yyyy'): t('now')}
                    </div>
                </div>
            </div>
        </div>
    );
}


