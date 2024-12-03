"use client"
// app/(dash)/request/RequestListPage.tsx

import { page, track } from '@/providers/analytics.service';
import { listRequests } from '@/providers/logged-in/request.service';
import React, { useEffect, useState } from 'react';
import { Request } from '@/models/request';
import { useTranslation } from 'react-i18next';
const RequestListPage = () => {
      
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        page('Request List page');
        loadData();

        return () => {
            track('page_exit', { page: 'Request List page' });
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        const response = await listRequests(currentPage, "&expand=requestSkills,candidateApplication");
        setRequests(response.body);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count'), 10));
        setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page'), 10));
        setLoading(false);
    };

    const doInfinite = async () => {
        if (currentPage < pageCount) {
            setLoading(true);
            const response = await listRequests(currentPage + 1, "&expand=requestSkills,candidateApplication");
            setRequests(prevRequests => [...prevRequests, ...response.body]);
            setCurrentPage(prevPage => prevPage + 1);
            setLoading(false);
        }
    };

    const viewRequest = async (event: React.MouseEvent<HTMLDivElement>, request: Request) => {
        event.preventDefault();
        event.stopPropagation();

        /*const modal = await window.customElements.get('request-view-page').create({
            request: request,
            request_uuid: request.request_uuid
        });

        modal.onDidDismiss().then(e => {
            if (!e.data || e.data.from !== 'native-back-btn') {
                window.history.back();
            }
        });
        modal.present();*/
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{t("Jobs")}</h1>
            </header>

            {loading && <div className="progress-bar">Loading...</div>}
            <div className="max-width">
                {requests.length > 0 ? (
                    requests.map((request: Request) => (
                        <div key={request.request_uuid} className="request-listing" onClick={(e) => viewRequest(e, request)}>
                            {/* Replace with your request listing component */}
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <h2>{request.request_position_title}</h2>
                                {/* Add more request details here */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">{t("No match found yet")}</p>
                )}

                {currentPage < pageCount && (
                    <button onClick={doInfinite} className="mt-4 text-blue-500">
                        {loading ? t("Loading more...") : t("Load More")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RequestListPage;