// app/(dash)/log-date-list/page.tsx

import { CandidateWorkingDate } from '@/models/candidate-working-date';
import { page, track } from '@/providers/analytics.service';
import { listWorkingDates } from '@/providers/logged-in/candidate-working-hour.service';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook

const LogDateListPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateWorkingDates, setCandidateWorkingDates] = useState<CandidateWorkingDate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    page('Candidate Working Hours');
    loadData();

    return () => {
      track('page_exit', { page: 'Candidate Working Hours' });
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await listWorkingDates(currentPage, '&expand=dateStatus,checkIn,checkOut');
    setLoading(false);
    setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
    setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
    setCandidateWorkingDates(response.body);
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleInfiniteScroll = async () => {
    if (currentPage < pageCount) {
      setLoading(true);
      const response = await listWorkingDates(currentPage + 1);
      setCandidateWorkingDates((prev) => [...prev, ...response.body]);
      setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
      setLoading(false);
    }
  };

  const secondsToTime = (secs: number) => {
    const h = Math.floor(secs / (60 * 60));
    const divisor_for_minutes = secs % (60 * 60);
    const m = Math.floor(divisor_for_minutes / 60);
    const divisor_for_seconds = divisor_for_minutes % 60;
    const s = Math.ceil(divisor_for_seconds);
    return `${h ? `${h}:` : ""}${m ? `${m}:${s}` : `${s}s`}`;
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <button onClick={() => window.history.back()} className="flex items-center">
            <img src="assets/images/icon-back.svg" alt="Back" />
          </button>
          <h1 className="text-2xl font-bold">{t("Time Log")}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        {loading && <div className="progress-bar">Loading...</div>}

        <div className="max-w-7xl mx-auto p-4">
          {candidateWorkingDates.map((candidateWorkingDate: any) => (
            <div key={candidateWorkingDate.date} className="date-wrapper bg-white shadow-md rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold">{new Date(candidateWorkingDate.date).toLocaleDateString()}</h2>
              <div className="health-indicator">
                {candidateWorkingDate.total_pending > 0 && <span className="pending">{candidateWorkingDate.total_pending}</span>}
                {candidateWorkingDate.total_approved > 0 && <span className="approved">{candidateWorkingDate.total_approved}</span>}
                {candidateWorkingDate.total_rejected > 0 && <span className="rejected">{candidateWorkingDate.total_rejected}</span>}
                {!candidateWorkingDate.end_time && <span className="working">{t("Working")}</span>}
              </div>
              <div className="time-wrapper">
                <b>{candidateWorkingDate.end_time ? secondsToTime(candidateWorkingDate.total_time) : t("On-Going")}</b>
                <span>
                  {new Date(candidateWorkingDate.start_time).toLocaleTimeString()} 
                  <span className="mx-2">→</span>
                  {candidateWorkingDate.end_time ? new Date(candidateWorkingDate.end_time).toLocaleTimeString() : t("Now")}
                </span>
              </div>
            </div>
          ))}

          {candidateWorkingDates.length === 0 && !loading && <p>{t("No record found")}</p>}

          {currentPage < pageCount && (
            <button onClick={handleInfiniteScroll} className="load-more">
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogDateListPage;