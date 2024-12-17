"use client"

// src/components/ActivityPage.tsx
import React, { useEffect, useState } from 'react';
 
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
import { listNotifications, markNotificationRead, markReadAllNotifications } from '@/providers/logged-in/candidate-notification.service';
import { alertCount$ } from '@/providers/event.service';
import NoItems from '@/components/common/no-items';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

//todo: button to mark all as read

const ActivityPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateNotifications, setCandidateNotifications] = useState([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
 
  const [showRefresh, setShowRefresh] = useState(false);
  const [totalUnreadActivity, setTotalUnreadActivity] = useState(0);

  useEffect(() => {
    alertCount$.subscribe((
      counts : any
    ) => {
      if(!counts)
        return null; 
         
      if (totalUnreadActivity > 0 && totalUnreadActivity != counts.totalUnreadActivity) {
        setShowRefresh(true);
      } /*else {
        this.showRefresh = false;
      }*/

      setTotalUnreadActivity(counts.totalUnreadActivity);
    });
  }, []);

  useEffect(() => {
    loadData();

    page('Activity List Page');

    return () => {
      track('page_exit', { page: 'Activity List Page' });
    }
  }, []);

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

  function getUrlParams() {
    //invitation.request.requestSkills,
    return "&expand=invitation,invitation.request,invitation.company," + 
      "company,staff,store,candidateWorkingHour,candidateWorkingDate,candidateWorkLogFeedback,candidateWorkLogFeedback.createdBy";
  }

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await listNotifications(page, getUrlParams());
      setCandidateNotifications(response.data);

      setPagination({
        current_page: parseInt(response.headers['x-pagination-current-page']),
        total_pages: parseInt(response.headers['x-pagination-page-count']),
      });

      setTotalUnreadActivity(response.headers['X-total-unread-actity']);
      
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

    await markNotificationRead(notification.cn_uuid);
  };

  return ( 
    <>
      <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                  { t('Activity')}
              </h5>

          </div>    
      </div>
      
      <div className="max-w-4xl mx-auto p-6"> 
         
        {showRefresh && (
          <Button onClick={doRefresh} className="rounded-full px-4 py-2 m-auto mb-4 block ">
            {t('Refresh')} <RefreshCw className='inline' />
          </Button>
        )}

      
        { candidateNotifications.map((candidateNotification: CandidateNotification) => (

          <div className="mb-4" key={candidateNotification.cn_uuid}>
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
    
          </div>   
        ))}
        
        <Pager pagination={pagination} loadPage={loadPage} />
         
        {candidateNotifications.length === 0 && !loading && (
          <NoItems image="assets/icons/no-invitation.svg" 
            title={ 'There are no activity yet!' }
            message='' />
        )} 
      </div>
    </>  
  );
};

export default ActivityPage;