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
  const contentRef = useRef(null);

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
      current_page: parseInt(response.headers.get('X-Pagination-Current-Page')),
      total_pages: parseInt(response.headers.get('X-Pagination-Page-Count'))
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
    <div className="flex flex-col h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <button onClick={() => window.history.back()} className="flex items-center">
            <img src="assets/images/icon-back.svg" alt="Back" />
          </button>
          {candidateWorkingDate && (
            <h1 className="text-2xl font-bold">
              {format(date || '', 'MMMM d, yyyy')}
            </h1>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto" ref={contentRef} onScroll={logScrolling}>
        <div className="max-w-7xl mx-auto p-4">
          {loading && <div className="progress-bar">Loading...</div>}

          <div className="main-card bg-white shadow-md rounded-lg p-4 mb-4">
            <span className="txt-label">{t("Total Time")}</span>
            {candidateWorkingDate && (
              <>
                <ul className="health-indicator">
                  {candidateWorkingDate.total_pending > 0 && (
                    <li className="pending">{candidateWorkingDate.total_pending}</li>
                  )}
                  {candidateWorkingDate.total_approved > 0 && (
                    <li className="approved">{candidateWorkingDate.total_approved}</li>
                  )}
                  {candidateWorkingDate.total_rejected > 0 && (
                    <li className="rejected">{candidateWorkingDate.total_rejected}</li>
                  )}
                </ul>
                <h4 className="txt-time">
                  {candidateWorkingDate.total_time
                    ? secondsToTime(candidateWorkingDate.total_time)
                    : t("On-Going")}
                </h4>
                <div className="time-wrapper">
                  <div className="time-left">
                    <b>{t("Start Time:")}</b>
                    <span>
                      {candidateWorkingDate.start_time
                        ? format(candidateWorkingDate.start_time || '', 'hh:mm a') 
                        : '-'}
                    </span>
                  </div>
                  <div className="time-right">
                    <b>{t("End Time:")}</b>
                    <span>
                      {candidateWorkingDate.end_time
                        ? format(candidateWorkingDate.end_time || '', 'hh:mm a') 
                        : t("Now")}
                    </span>
                  </div>
                </div>
                <ul className="health-bar">
                  {candidateWorkingDate.total_pending > 0 && (
                    <li className="pending">
                      {candidateWorkingDate.total_pending} {t("Pending")}
                    </li>
                  )}
                  {candidateWorkingDate.total_approved > 0 && (
                    <li className="approved">
                      {candidateWorkingDate.total_approved} {t("Approved")}
                    </li>
                  )}
                  {candidateWorkingDate.total_rejected > 0 && (
                    <li className="rejected">
                      {candidateWorkingDate.total_rejected} {t("Rejected")}
                    </li>
                  )}
                </ul>
                <ul className="health-bar">
                  {!candidateWorkingDate.end_time && (
                    <li className="working">{t("Working")}</li>
                  )}
                </ul>
              </>
            )}
          </div>

            { totalCount > 0 && (
          <div className="session-wrapper">
            <h5 className="txt-session-heading">
              {t("Sessions")} <span>({totalCount})</span>
            </h5>

            {candidateWorkingHourData.map((hour) => (
              <WorkLog key={hour.candidate_working_hour_uuid} hour={hour} />
            ))}

            <Pager pagination={pagination} loadPage={loadPage} />
 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogHourListPage;