"use client"
// app/(dash)/interview/InterviewListPage.jsx

import Request from '@/components/app/request';
import { RequestInterview } from '@/models/request-interview';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { listInterviewRequests } from '@/providers/logged-in/request.service';
import React, { useEffect, useState } from 'react';


const InterviewListPage = () => {
    const [loading, setLoading] = useState(false);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        page('Interview List page');
        loadData();

        const subscription = requestUpdated$.subscribe(() => {
            loadData();
        });

        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Interview List page' });
        };
    }, []);

    const loadData = async () => {
        setLoading(true);
        const response = await listInterviewRequests(currentPage);
        setInterviews(response.body);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
        setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
        setLoading(false);
    };

    const doInfinite = async () => {
        if (currentPage < pageCount) {
            setLoading(true);
            const nextPage = currentPage + 1;
            const response = await listInterviewRequests(nextPage);
            setInterviews((prev: any[]) => [...prev, ...response.body]);
            setCurrentPage(nextPage);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h3 className="text-3xl font-bold capitalize">Scheduled Interviews</h3>
            {loading && <div className="progress-bar">Loading...</div>}
            <div className="flex flex-col">
                {interviews.map((interview) => (
                    <Request key={interview.id} request={interview.request} interview={interview} />
                ))}
                {!loading && interviews.length === 0 && (
                    <p>~ Your scheduled interviews will be listed here ~</p>
                )}
            </div>  
            {currentPage < pageCount && (
                <button onClick={doInfinite} className="btn-infinite-scroll">
                    Load More
                </button>
            )}
        </div>
    );
};

export default InterviewListPage;