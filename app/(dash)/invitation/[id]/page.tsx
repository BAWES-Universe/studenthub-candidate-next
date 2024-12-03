"use client"
// app/(dash)/invitation/InvitationDetailPage.jsx

import { Invitation } from '@/models/invitation';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { detailInvitation } from '@/providers/logged-in/invitation.service';
import { useParams } from 'next/dist/client/components/navigation';
import React, { useEffect, useState } from 'react';

const InvitationDetailPage = () => {
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState<Invitation | null>(null);

    useEffect(() => {
        page('Invitation Detail page');
        loadInvitationDetail();

        const subscription = requestUpdated$.subscribe(() => {
            loadInvitationDetail();
        });

        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Invitation Detail page' });
        };
    }, []);

    const loadInvitationDetail = async () => {
        setLoading(true);
        const data = await detailInvitation(id);
        setModel(data);
        setLoading(false);
    };

    const accept = async () => {
        /*const invitation = { ...model, invitation_status: 3 }; // accept
        const modal = await Modal.create({
            component: InvitationFeedbackPage,
            componentProps: { invitation }
        });
        modal.present();
        const { data } = await modal.onDidDismiss();
        if (data && data.refresh) {
            loadInvitationDetail();
        }*/
    };

    const reject = async () => {
        /*const invitation = { ...model, invitation_status: 2 }; // reject
        const modal = await Modal.create({
            component: InvitationFeedbackPage,
            componentProps: { invitation }
        });
        modal.present();
        const { data } = await modal.onDidDismiss();
        if (data && data.refresh) {
            loadInvitationDetail();
        }*/
    };

    const companyDetailPage = async () => {
       /* const modal = await Modal.create({
            component: CompanyPage,
            componentProps: { company: model.company }
        });
        modal.present();*/
    };

    return (
        <div className="p-4">
            {loading && <div className="progress-bar">Loading...</div>}
            {model && (
                <>
                    <button onClick={() => window.history.back()} className="btn-close">
                        <img src="assets/images/ic_cancel.svg" alt="Close" />
                    </button>

                    <p className="job-type">
                        {model.request && model.request.request_position_type === 1
                            ? "You’d be working full-time as a"
                            : "You’d be working part-time as a"}
                    </p>

                    <p className="txt-position-title">{model.request && model.request.request_position_title}</p>

                    <p className="company">
                        {`At ${model.company && model.company.company_common_name_en || model.company && model.company.company_name},`}
                    </p>

                    { model.request &&  
                        <p className="job-desc" dangerouslySetInnerHTML={{ __html: model.request.request_job_description || "" }} />
                    }

                    {model.request && model.request.request_compensation && (
                        <>
                            <h3>Compensation</h3>
                            <p className="job-compensation" dangerouslySetInnerHTML={{ __html: model.request.request_compensation }} />
                        </>
                    )}

                    <h2>Job location</h2>

                    <p className="job-location">{model.request && model.request.request_location}</p>

                    {model.request && model.request.requestSkills && model.request.requestSkills.length > 0 && (
                        <>
                            <h2>Skills</h2>
                            {model.request && model.request.requestSkills && model.request.requestSkills.map((skill) => (
                                <span key={skill.skill} className="badge">{skill.skill}</span>
                            ))}
                        </>
                    )}

                    {model.invitation_status === 1 && (
                        <div>
                            <button className="btn-apply" onClick={companyDetailPage}>More about company</button>
                            <button className="btn-apply" onClick={accept}>I’d like to apply</button>
                            <button className="btn-reject" onClick={reject}>Reject</button>
                        </div>
                    )}

                    {/* Additional status handling can be added here */}
                </>
            )}
        </div>
    );
};

export default InvitationDetailPage;