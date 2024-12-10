"use client"
// app/(dash)/dashboard/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profile } from '@/providers/logged-in/account.service';
//import { workHistory } from '@/providers/logged-in/candidate.service';
import AccountStatus from '@/components/app/account-status';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CandidateWorkHistory } from '@/models/candidate-work-history';
import { listWorkHistory } from '@/providers/logged-in/candidate.service';
import { page, track } from '@/providers/analytics.service';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setUser } from '@/store/slices/userSlice';
 

const DashboardPage = () => {
    
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [workHistory, setWorkHistory] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [pushNotificationAvailable, setPushNotificationAvailable] = useState(true);
    const router = useRouter();
    const { user } = useAppSelector(state => state.user);

    const { t} = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user)
        loadProfile();

        loadWorkHistoryData();
        //setInvitationSubscription();

        page('Home Page');

        return () => {
            track('page_exit', { page: 'Home Page' });
        }
  
    }, []);

    const loadProfile = async () => {
        setLoadingProfile(true);
        try {
            const data = await profile();
            dispatch(setUser({
                user: data
            }));

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const setSubscription = () => {
        // TODO: Implement subscription logic
    };

    const loadWorkHistoryData = async () => {
        const response = await listWorkHistory();
        setWorkHistory(response);
    };
 

    const downloadCertificate = async (event: any) => {
      /*  const modal = await openModal(WorkHistoryPage, { candidate, workHistory });
        modal.onDidDismiss();*/
    };

    const openModal = async (Component: any, props: any) => {
        // Implement modal opening logic here
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
             
            {loadingProfile && <div className="progress-bar">Loading...</div>}
            {user && (
                <div>
                    {/* Student Account Status */}
                    <AccountStatus />

                    {/* Push Notification Card */}
                    {pushNotificationAvailable && (
                        <Card className="p-0 mb-4">
                            <CardHeader>
                            <CardTitle className='font-bold'>Receive faster updates by enabling push notifications</CardTitle>
                        </CardHeader>
                        <CardContent>      
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">
                                { t("We’ll still email you important updates. This is cool if you aren’t an email person or would like to receive faster updates.") }</p>
                            <Button variant={'outline'}onClick={() => setSubscription()}>
                                { t("Enable notifications") }
                            </Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Scheduled Interviews Card */}
                    {user?.totalInterviewScheduled && user?.totalInterviewScheduled > 0 && (
                        <Card className="p-0 mb-4">
                             <CardHeader>
                            <CardTitle className='font-bold'>Scheduled interviews</CardTitle>
                        </CardHeader>

                        <CardContent>    
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight" dangerouslySetInnerHTML={{ 
                            __html: t('txt_interview_scheduled', { 
                                value: user.totalInterviewScheduled }) }}></p>
                            <Button variant={'outline'} onClick={() => router.push('/interview-list')} className="btn-bank-detail">View</Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Civil ID Card */}
                    {(
                        !user?.candidate_civil_photo_front || 
                        !user?.candidate_civil_photo_back || 
                        !user?.candidate_civil_expiry_date || 
                        user?.civilExpired
                    ) && (
                        <Card className="p-0 mb-4"> 
                            <CardHeader>
                                <CardTitle className='font-bold'>Urgent Civil Detail</CardTitle>
                            </CardHeader>
                            <CardContent>    
                                <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">You won’t be able to receive payments until we have your valid civil ID.</p>
                                <Button variant={'outline'} className="btn-civil-detail" onClick={
                                    () => router.push('/civil-id?from-profile=1')}>
                                    Upload Civil ID
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Bank Details Card */}
                    {user?.bank_account_needed == 1 && (
                        <Card className="p-0 mb-4">
                             <CardHeader>
                            <CardTitle className='font-bold' dangerouslySetInnerHTML={{ __html: t('urgent_bank_detail') }}></CardTitle>
                        </CardHeader>
                        <CardContent>    
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">You won’t be able to receive payments until we have your bank information.</p>
                            <Button variant={'outline'} className="btn-bank-detail" onClick={() => router.push('/bank')}>
                                Enter my bank information
                            </Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Video Recording Card */}
                    {user?.candidate_job_search_status && !user?.candidate_video && (
                        <Card className="p-0 mb-4">
                            <CardHeader>
                            <CardTitle className='font-bold'>Increase your chances of landing a job by recording an intro video</CardTitle>
                        </CardHeader>
                        <CardContent>  
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">
                            While optional, an intro video makes your profile stand out to employers. It shows that you have the confidence required for the job and gives them the first impression they need to see you as something more than just a paper CV.
                            </p>
                            <Button variant={'outline'} className="btn-video-recording" 
                                onClick={() => router.push('/video?from-profile=1')}>
                                I’d like to start recording
                            </Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Working Logs Card */}
                    {user?.working_hour_count > 0 && (
                        <Card className="p-0 mb-4">
                        <CardHeader>
                            <CardTitle className='font-bold'>Working logs</CardTitle>
                        </CardHeader>
                        <CardContent> 
                            <Button variant={'outline'} onClick={() => router.push('/log-date-list')} className="btn-video-recording">Click here to view your working logs</Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Wallet Card */}
                    <Card className="p-0 mb-4">
                        <CardHeader>
                            <CardTitle className='font-bold'>Wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant={'outline'} onClick={() => router.push('/wallet')} className="btn-video-recording">
                                Click here to view your wallet balance
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Work History Card */}
                    {workHistory.length > 0 && (
                        
                        <div className="card-work-details">
                            
                            <h4 className='font-bold my-4'>Your history with StudentHub</h4>

                            {workHistory.map((history: CandidateWorkHistory, index: number) => (
                                <Card key={index} className="p-0 mb-4">
                                    <CardHeader>
                                        <CardTitle className='font-bold'>
                                        { history.company.parentCompany && (
                                                 history.company.parentCompany.company_common_name_en? 
                                                 history.company.parentCompany.company_common_name_en: history.company.parentCompany.company_name) }
                                                 
                                            { !history.company.parentCompany && (
                                                 history.company.company_common_name_en? 
                                                 history.company.company_common_name_en: history.company.company_name) }

                                        </CardTitle>
                                        <CardDescription className='font-bold'>
                                            {history.store && history.store.store_name}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <p className="mb-0 text-[#68687a] text-sm font-normal leading-tight">{
                                            `${format(new Date(history.start_date || ""), 'MMMM d, yyyy')} to 
                                            ${ history.end_date?format(new Date(history.end_date), 'MMMM d, yyyy') : t('now')}`
                                            }</p>
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant={'outline'}onClick={downloadCertificate} className="download-btn">
                                Download Certificates
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;