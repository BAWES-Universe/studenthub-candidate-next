"use client"
// app/(dash)/log-hour-list/page.tsx

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { format, parseISO } from 'date-fns'; // For date formatting
import { useParams } from 'next/dist/client/components/navigation';
import { listHours, workingDateDetail } from '@/providers/logged-in/candidate-working-hour.service';
import { page, track } from '@/providers/analytics.service';
import WorkLog from '@/components/app/work-log';
import { secondsToTime } from '@/utils/common';
import Pager from '@/components/common/pager';

const LogHourListPage = () => {
  const { date } = useParams() as { date: string }; // Get date from URL parameters
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateWorkingHourData, setCandidateWorkingHourData] = useState<any[]>([]);
  const [candidateWorkingDate, setCandidateWorkingDate] = useState<any>(null);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    page('Candidate Working Hours');
    loadData();
    loadDetail();

    return () => {
      track('page_exit', { page: 'Candidate Working Hours' });
    }
  }, [date]);

  const loadDetail = async () => {
    const res = await workingDateDetail(date);
    setCandidateWorkingDate(res);
  };

  const loadData = async (page  = 1) => {
    setLoading(true);
    const response = await listHours(page, getUrlParams());
    setLoading(false);

    setPagination({
      current_page: parseInt(response.headers.get('x-pagination-current-page')),
      total_pages: parseInt(response.headers.get('x-pagination-page-count'))
    });

    setTotalCount(parseInt(response.headers.get('X-Pagination-Total-Count')));
    setCandidateWorkingHourData(response.data);
  };

  const doRefresh = async () => {
    await loadData();
    await loadDetail();
  };

  
  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadData(page);
  }

  const getUrlParams = () => {
    return `&date=${format(parseISO(date), 'yyyy-MM-dd')}`;
  };

  const logScrolling = (e: any) => {
    // Broadcast scroll event
  };

  return (
    <>
      <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
              {format(date || '', 'MMMM d, yyyy')}
              </h5>

          </div>    
      </div>
      
      <div className="max-w-4xl mx-auto p-6 w-full">
        { candidateWorkingDate && 
          <div className="p-4 bg-white mb-6 rounded-lg shadow flex-col justify-start items-center gap-4 flex">
            <div className="self-stretch justify-start items-start gap-2 flex">
                <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex">
                    <div className="text-[#7d7d8d] text-sm font-medium  leading-tight">Total Time</div>
                    <div className="text-[#22223d] text-xl font-semibold  leading-7">
                    {candidateWorkingDate.total_time
                      ? secondsToTime(candidateWorkingDate.total_time)
                      : t("On-Going")}
                    </div>
                </div>
            </div>
            <div className="self-stretch h-px bg-[#eeeef0]"></div>
            <div className="self-stretch justify-between items-start flex">
                <div className="justify-start items-start gap-1 flex">
                    <div className="text-[#22223d] text-sm font-semibold  leading-tight">Start Time:</div>
                    <div className="text-[#4b4b61] text-sm font-normal  leading-tight">
                    {candidateWorkingDate.start_time
                          ? format(candidateWorkingDate.start_time || '', 'hh:mm a') 
                          : '-'}
                    </div>
                </div>
                <div className="justify-end items-center gap-1 flex">
                    <div className="text-[#22223d] text-sm font-semibold  leading-tight">End Time:</div>
                    <div className="text-[#4b4b61] text-sm font-normal  leading-tight">
                    {candidateWorkingDate.end_time
                          ? format(candidateWorkingDate.end_time || '', 'hh:mm a') 
                          : t("Now")}
                    </div>
                </div>
            </div>
            <div className="self-stretch justify-start items-center gap-2.5 flex">
                {!candidateWorkingDate.end_time && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#4c6ff2] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_pending} Working</div>
                    </div>
                </div>)}

                {candidateWorkingDate.end_time && (<>  
                {candidateWorkingDate.total_pending > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#f2994a] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_pending} Pending</div>
                    </div>
                </div>)}
                {candidateWorkingDate.total_approved > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#28b563] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_approved} Approved</div>
                    </div>
                </div>)}
                {candidateWorkingDate.total_rejected > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#eb5757] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_rejected} Rejected</div>
                    </div>
                </div>)}
                </>)}
            </div>
          </div> 
          }

          { totalCount > 0 && (
          <div className="session-wrapper">
            
            <h5 className="text-[#22223d] text-lg font-semibold mb-4 leading-7">
              {t("Sessions")} <span className='text-[#7d7d8d]'>({totalCount})</span>
            </h5>

            {candidateWorkingHourData.map((hour) => (
              <WorkLog key={hour.candidate_working_hour_uuid} hour={hour} />
            ))}

            <Pager pagination={pagination} loadPage={loadPage} />

            </div>
          )} 

          {loading && <div className="progress-bar">Loading...</div>}

      </div>       
    </>
  );
};

export default LogHourListPage;