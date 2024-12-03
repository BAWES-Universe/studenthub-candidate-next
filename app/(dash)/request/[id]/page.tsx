"use client"
// app/(dash)/request/RequestViewPage.tsx

import { Request } from '@/models/request';
import { page, track } from '@/providers/analytics.service';
import { viewRequest, applyRequest } from '@/providers/logged-in/request.service';
import { errorMessage, toDate } from '@/utils/common';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RequestViewPage = () => {

    const { id } = useParams() as { id: string };
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        loadDetails();

        page('Request View Page');

        return () => {
            track('page_exit', { page: 'Request View Page' });
        }
    }, []);

    const loadDetails = async () => {
        setLoading(true);
        const data = await viewRequest(id);
        setRequest(data);
        setLoading(false);
    };

    const apply = async () => {
        setApplying(true);
        const { data } = await applyRequest(id);
        if (data.operation === "success") {
            setRequest(prevRequest => ({ ...prevRequest, candidateApplication: data.candidateApplication }));
            dismiss();
        } else {
            alert(errorMessage(data.message));
        }
        setApplying(false);
    };

    const dismiss = () => {
        // Logic to dismiss the modal or navigate back
        window.history.back();
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <div className="flex justify-between items-center">
                <button onClick={dismiss} className="btn-close">
                    <img src="assets/images/ic_cancel.svg" alt="Close" />
                </button>
            </div>

            {loading && <div className="progress-bar">Loading...</div>}

            {request && (
                <div>
                    <p className="job-type">
                        {request.request_position_type === 1 ? t("You’d be working full-time as a") : t("You’d be working part-time as a")}
                    </p>
                    <p className="txt-position-title">{request.request_position_title}</p>

                    <p className="company">
                        {t("At")} <span>{request.company?.company_common_name_en || request.company?.company_name}</span>,
                    </p>

                    <p className="job-desc" dangerouslySetInnerHTML={{ __html: request.request_job_description || "" }}></p>

                    {request.request_compensation && (
                        <div>
                            <h3>{t("Compensation")}</h3>
                            <p className="job-compensation" dangerouslySetInnerHTML={{ __html: request.request_compensation }}></p>
                        </div>
                    )}

                    {request.request_location && (
                        <div>
                            <h2>{t("Job location")}</h2>
                            <p className="job-location">{request.request_location}</p>
                        </div>
                    )}

                    {request.requestSkills && request.requestSkills.length > 0 && (
                        <div>
                            <h2>{t("Skills")}</h2>
                            {request.requestSkills.map(skill => (
                                <span key={skill.skill} className="ion-badge">{skill.skill}</span>
                            ))}
                        </div>
                    )}

                    {request.candidateApplication && (
                        <p>
                            {
                                t("txt_applied_at", { 
                                    value: toDate(request.candidateApplication.created_at)?.toLocaleDateString() 
                                })
                            }
                        </p>
                    )}
                </div>
            )}

            {!request?.candidateApplication && (
                <footer>
                    <button onClick={apply} disabled={applying} className="btn-apply">
                        {applying ? <span>Loading...</span> : t("Apply")}
                    </button>
                </footer>
            )}
        </div>
    );
};

export default RequestViewPage;