// app/(dash)/assignment/page.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { workHistoryDetail } from '@/providers/logged-in/candidate.service';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { listWorkingDates } from '@/providers/logged-in/candidate-working-hour.service';
import { CardContent } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { CandidateWorkingDate } from '@/models/candidate-working-date';
import Pager from '@/components/common/pager';
import { page, track } from '@/providers/analytics.service';
// Import necessary components and services

const CandidateAssignmentPage = () => {
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any>(null);
    const [segment, setSegment] = useState("logs");
    const [start_date, setStartDate] = useState<string | null>(null);
    const [end_date, setEndDate] = useState<string | null>(null);
    const [candidateWorkingDates, setCandidateWorkingDates] = useState([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    useEffect(() => {
        loadAssignment();
        loadPage(1);

        page('Assignment Page');

        return () => {
            track('page_exit', { page: 'Assignment Page' });
        }
    }, [id]);

    const loadAssignment = async () => {
        setLoading(true);
        workHistoryDetail(id).then(res => {
            setHistory(res);
        }).finally(() => {
            setLoading(false);
        });
    };

    const loadPage = (page: number) => {
          
        if (page > pagination.total_pages || page < 1) {
            return;
        }

        setLoading(true);
        listWorkingDates(page, getUrlParams()).then((res: any) => {
            setCandidateWorkingDates(res.data);
            setPagination({
                current_page: parseInt(res.headers['X-Pagination-Current-Page']),
                total_pages: parseInt(res.headers['X-Pagination-Page-Count']),
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const getUrlParams = () => {
        let url = '&candidate_id=' + history.candidate_id + 
        "&store_id=" + history.store_id;

        if (start_date) {
            url += "&start_date=" + start_date;
        }
    
        if (end_date) {
            url += "&end_date=" + end_date;
        }

        return url;
    }

    //meta tags?  {history ? history.store.store_name : history.company.company_name}

    return (
        <div className="max-w-screen-lg mx-auto">
             
            <div className="flex space-x-4 p-4">
                <button onClick={() => setSegment("logs")} className={`p-2 ${segment === "logs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    Logs
                </button>
                <button onClick={() => setSegment("details")} className={`p-2 ${segment === "details" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    Details
                </button>
            </div>

            <div className="p-4">
                {segment === "details" && (
                    <div>
                        <h4 className="text-lg font-semibold">{/* Translated "Assignment Details" */}</h4>
                        <div className="mb-4">
                            <div className="text-gray-600">Employer</div>
                            <div>{history?.company?.company_name}</div>
                        </div>
                        {/* Add more detail items here */}
                    </div>
                )}

                {segment === "logs" && (
                    <div>
                        {/* Render logs here */}
                        {candidateWorkingDates.map((date: CandidateWorkingDate) => (
                            <div key={date.date} className="border p-4 mb-4">
                                <h2>{format(new Date(date.date || ''), 'MMMM d, yyyy')}</h2>
                                {/* Add more log details */}
                            </div>
                        ))}

                        <Pager pagination={pagination} loadPage={loadPage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateAssignmentPage;