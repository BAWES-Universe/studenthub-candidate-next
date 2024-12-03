"use client"
// app/(dash)/invitations/InvitationsPage.jsx

import Invitation from '@/components/app/invitation';
import NoItems from '@/components/common/no-items';
import { Invitation as InvitationModel } from '@/models/invitation';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { listInvitations } from '@/providers/logged-in/invitation.service';
import React, { useEffect, useState } from 'react';


const InvitationsPage = () => {
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<InvitationModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        
        loadInvitations();

        const subscription = requestUpdated$.subscribe(() => {
            loadInvitations();
        });

        page('Invitation List page');
        
        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Invitation List page' });
        };
    }, []);

    const loadInvitations = async () => {
        setLoading(true);
        const data = await listInvitations(currentPage);
        setInvitations(data);
        setLoading(false);
    };

    const doInfinite = async () => {
        if (currentPage < pageCount) {
            setLoading(true);
            const nextPage = currentPage + 1;
            const response = await listInvitations(nextPage);
            setInvitations((prev: any[]) => [...prev, ...response]);
            setCurrentPage(nextPage);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h3 className="text-3xl font-bold capitalize">Invitations</h3>
            {loading && <div className="progress-bar">Loading...</div>}
            <div className="flex flex-col">
                {invitations.map((invitation: any) => (
                    <Invitation key={invitation.id} model={invitation} />
                ))}
                {!loading && invitations.length === 0 && (
                    <NoItems image="assets/icons/no-invitation.svg" message="~ No invitation yet ~" />
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

export default InvitationsPage;