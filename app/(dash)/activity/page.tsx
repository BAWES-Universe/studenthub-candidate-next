"use client"

// src/components/ActivityPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // For translations
import WorkHourApproved from '@/components/app/work-hour-approved';
import WorkHourRejected from '@/components/app/work-hour-rejected';
import Assigned from '@/components/app/assigned';
import Unassigned from '@/components/app/unassigned';
import TransferUnpaid from '@/components/app/transfer-unpaid';
import TransferPaid from '@/components/app/transfer-paid';
import WorkSessionRejected from '@/components/app/work-session-rejected';
import WorkSessionApproved from '@/components/app/work-session-approved';
import InvitationNotification from '@/components/app/invitation-notification';
import TransferInit from '@/components/app/transfer-init';
import { CandidateNotification } from '@/models/candidate-notification';
import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';

const ActivityPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateNotifications, setCandidateNotifications] = useState([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [totalUnreadActivity, setTotalUnreadActivity] = useState(0);
  const [showRefresh, setShowRefresh] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    loadData();

    page('Activity List Page');

    return () => {
      track('page_exit', { page: 'Activity List Page' });
    }
  }, [pagination.current_page]);

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

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/notifications?page=${page}`);
      setCandidateNotifications(response.data.notifications);
      setPagination({
        current_page: parseInt(response.headers['X-Pagination-Current-Page']),
        total_pages: parseInt(response.headers['X-Pagination-Page-Count']),
      });
      setTotalUnreadActivity(response.data.totalUnreadActivity);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const doRefresh = async (event: any) => {
    setShowRefresh(false);
    await loadPage(1);
  };

  const markRead = async (notification: CandidateNotification) => {
    notification.is_new = false;
    await axios.post(`/api/notifications/mark-read/${notification.cn_uuid}`);
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <main ref={contentRef} className="p-4">
        {loading && <div className="loader">Loading...</div>}
        <div className="space-y-4">
          { candidateNotifications.map((candidateNotification: CandidateNotification) => (

            <>
               {
                candidateNotification.type == 3 ? <WorkHourApproved 
        onClick={() => markRead(candidateNotification)}
        candidateNotification={candidateNotification}></WorkHourApproved>: null
               } 
          
               {
                    candidateNotification.type == 4 ? <WorkHourRejected 
        onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></WorkHourRejected>: null 
            }

            {
                candidateNotification.type == 8 ? <WorkSessionApproved 
        onClick={() => markRead(candidateNotification)}
        candidateNotification={candidateNotification}></WorkSessionApproved>: null}
          
      {
                candidateNotification.type == 9 ? <WorkSessionRejected 
        onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></WorkSessionRejected>: null }
          
      {
                candidateNotification.type == 0 ? <InvitationNotification
        onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></InvitationNotification>: null
      }

      {
                candidateNotification.type == 1 ? <Assigned 
      onClick={() => markRead(candidateNotification)}
        candidateNotification={candidateNotification}></Assigned>: null
      }
      
      {
                candidateNotification.type == 2 ? <Unassigned 
      onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></Unassigned>: null }

      {
                candidateNotification.type == 5 ? <TransferInit 
      onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></TransferInit>: null
      }

      {
                candidateNotification.type == 6 ? <TransferPaid 
      onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></TransferPaid>: null
      }

      {
                candidateNotification.type == 7 ? <TransferUnpaid 
      onClick={() => markRead(candidateNotification)}
          candidateNotification={candidateNotification}></TransferUnpaid>: null
      }

      { /*
                candidateNotification.type == 10 ? <ion-card *ngSwitchDefault tappable
      onClick={() => markRead(candidateNotification)}
        candidateNotification={candidateNotification}> 
        <ion-card-content>
          {{ candidateNotification.message }}
        </ion-card-content>
      </ion-card>: null */ }
  
  </>   
          ))}
        </div>

        {showRefresh && (
          <button onClick={doRefresh} className="btn-refresh bg-warning text-white rounded-full px-4 py-2">
            {t('Refresh')}
          </button>
        )}

        <Pager pagination={pagination} loadPage={loadPage} />
         
        {candidateNotifications.length === 0 && !loading && (
          <div className="text-center">
            <img src="assets/icons/no-invitation.svg" alt="No activity" />
            <p>~ No activity yet ~</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ActivityPage;