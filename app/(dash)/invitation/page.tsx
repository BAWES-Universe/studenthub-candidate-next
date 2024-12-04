"use client"
// app/(dash)/invitations/InvitationsPage.jsx

import Invitation from '@/components/app/invitation';
import NoItems from '@/components/common/no-items';
import Pager from '@/components/common/pager';
import { Invitation as InvitationModel } from '@/models/invitation';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { listInvitations } from '@/providers/logged-in/invitation.service';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';


const InvitationsPage = () => {
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<InvitationModel[]>([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

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

    const loadInvitations = async (page = 1) => {
        setLoading(true);
        const data = await listInvitations(page);
        setInvitations(data);
        setLoading(false);
    };

    
  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadInvitations(page);
  }

    return (
        <div className="max-w-4xl mx-auto p-4">
            
            {loading && <div className="progress-bar">Loading...</div>}
            <div className="flex flex-col">
                {invitations.map((invitation: any) => (
                    <Invitation key={invitation.id} model={invitation} />
                ))}
                {!loading && invitations.length === 0 && (
                    <NoItems image="assets/icons/no-invitation.svg" 
                        title={ 'There are no assignments yet!' }
                        message={ 'Our team is working hard to find you the suitable assigment for you. Stay tight!' } />
                )}
            </div>
            
            <Pager pagination={pagination} loadPage={loadPage} />

        </div>
    );
};

export default InvitationsPage;