// components/App/WorkLog.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { ArrowRight } from 'lucide-react';
import { secondsToTime } from '@/utils/common';
import { format } from 'date-fns';

const WorkLog = ({ hour }: { hour: any }) => {
    const { t } = useTranslation();

    return (

        <div className="cursor-pointer w-full p-4 bg-white rounded-lg shadow flex-col justify-center items-start gap-1.5 inline-flex mb-4">
            <div className="self-stretch justify-start items-start gap-1 inline-flex">
                <div className="grow shrink basis-0 text-[#22223d] text-base font-medium leading-normal">
                    {hour.end_time ? secondsToTime(hour.total_time) : t("On-Going")}
                </div>
        
                {hour.end_time && (
                    <>
                    {hour.status === 0 && <div className="px-1.5 py-0.5 bg-[#fff7ef] rounded-md justify-start items-start gap-2.5 flex">
                        <div className="text-right text-[#CA7F3E] text-sm font-medium leading-tight">{t("Pending")}</div> 
                    </div>}

                    {hour.status === 1 && <div className="h-6 px-1.5 py-0.5 bg-[#edfcf3] rounded-md justify-start items-start gap-2.5 inline-flex">
                        <div className="text-right text-[#28b563] text-sm font-medium leading-tight">{t("Approved")}</div>
                    </div> }

                    {hour.status === 2 && <div className="h-6 px-1.5 py-0.5 bg-[#fff2f2] rounded-md justify-start items-start gap-2.5 inline-flex">
                        <div className="text-right text-[#eb5757] text-sm font-medium leading-tight">{t("Rejected")}</div>
                    </div> } 
                    </> )}

            </div>
            <div className="self-stretch justify-start items-center gap-1 inline-flex">
                <div className="justify-end items-center gap-2 flex">
                    <div className="text-[#4b4b61] text-sm font-normal leading-tight">
                    {format(hour.start_time || '', 'hh:mm a')} 
                    </div>
                    <span className="mx-2">→</span>
                    { /*<ArrowRight className='inline mx-2 w-6 h-6 relative'  /> */}
                    <div className="text-[#4b4b61] text-sm font-normal leading-tight">
                    {hour.end_time 
                            ? format(hour.start_time || '', 'hh:mm a') 
                            : t("Now")}
                    </div>
                </div>
            </div>
            <div className="self-stretch justify-between items-center inline-flex">
                <div className="h-5 justify-start items-center gap-2 flex">
                    <div className="text-[#22223d] text-sm font-medium leading-tight">{t("Tracking Method")}:</div>
                </div>
                <div className="justify-end items-center gap-2 flex">
                    <div className="text-[#22223d] text-sm font-normal leading-tight">{t(hour.via)}</div>
                </div>
            </div>
        </div>
    );
};

WorkLog.propTypes = {
    hour: PropTypes.shape({
        end_time: PropTypes.string,
        total_time: PropTypes.number.isRequired,
        start_time: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        via: PropTypes.string.isRequired,
    }).isRequired,
};

export default WorkLog;
