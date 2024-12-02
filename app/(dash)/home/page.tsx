// app/(dash)/dashboard/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { profile } from '@/providers/logged-in/account.service';
//import { workHistory } from '@/providers/logged-in/candidate.service';
import AccountStatus from '@/components/app/account-status';
import { useAppSelector } from '@/store/store';
import { CandidateWorkHistory } from '@/models/candidate-work-history';
import { listWorkHistory } from '@/providers/logged-in/candidate.service';
import { page, track } from '@/providers/analytics.service';

const DashboardPage = () => {
    const [candidate, setCandidate] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [workHistory, setWorkHistory] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [pushNotificationAvailable, setPushNotificationAvailable] = useState(true);
    const router = useRouter();
    const { user } = useAppSelector(state => state.user);

    useEffect(() => {
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
            setCandidate(data);
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

    const updateCivilID = (event: any) => {
        event.preventDefault();
        //router.push('/view/profile', { updateCivilId: true });
    };

    const updateBank = async (event: any) => {
        event.preventDefault();
        /*const modal = await openModal(UpdateBankPage, { candidate });
        modal.onDidDismiss().then((e) => {
            if (e.data && e.data.refresh) {
                loadProfile();
            }
        });*/
    };

    const updateVideo = async (event: any) => {
        /*const modal = await openModal(UploadVideoPage, { candidate });
        modal.onDidDismiss().then((e) => {
            if (e.data && e.data.candidate_video) {
                setCandidate((prev) => ({ ...prev, candidate_video: e.data.candidate_video }));
            }
        });*/
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
            <h3 className="text-3xl font-bold capitalize">Home</h3>
            {loadingProfile && <div className="progress-bar">Loading...</div>}
            {candidate && (
                <div>
                    {/* Student Account Status */}
                    <AccountStatus />

                    {/* Push Notification Card */}
                    {pushNotificationAvailable && (
                        <div className="card-notification">
                            <h4>Receive faster updates by enabling push notifications</h4>
                            <p>We’ll still email you important updates...</p>
                            <button onClick={() => setSubscription()} className="btn-video-recording">Enable notifications</button>
                        </div>
                    )}

                    {/* Scheduled Interviews Card */}
                    {user?.totalInterviewScheduled && user?.totalInterviewScheduled > 0 && (
                        <div className="card-bank-details">
                            <h4>Scheduled interviews</h4>
                            <p>{`You have ${user?.totalInterviewScheduled} scheduled interviews.`}</p>
                            <button onClick={() => router.push('/interview-list')} className="btn-bank-detail">View</button>
                        </div>
                    )}

                    {/* Civil ID Card */}
                    {(!user?.candidate_civil_photo_front || !user?.candidate_civil_photo_back || !user?.candidate_civil_expiry_date || user?.civilExpired) && (
                        <div className="card-bank-details" onClick={updateCivilID}>
                            <h4>Urgent Civil Detail</h4>
                            <p>You won’t be able to receive payments until we have your valid civil ID.</p>
                            <button className="btn-civil-detail">Upload Civil ID</button>
                        </div>
                    )}

                    {/* Bank Details Card */}
                    {user?.bank_account_needed && (
                        <div className="card-bank-details" onClick={updateBank}>
                            <h4>Urgent Bank Detail</h4>
                            <p>You won’t be able to receive payments until we have your bank information.</p>
                            <button className="btn-bank-detail">Enter my bank information</button>
                        </div>
                    )}

                    {/* Video Recording Card */}
                    {user?.candidate_job_search_status && !user?.candidate_video && (
                        <div className="card-bank-details" onClick={updateVideo}>
                            <h4>Increase your chances of landing a job by recording an intro video</h4>
                            <p>While optional, an intro video makes your profile stand out...</p>
                            <button className="btn-video-recording">I’d like to start recording</button>
                        </div>
                    )}

                    {/* Working Logs Card */}
                    {user?.working_hour_count > 0 && (
                        <div className="card-bank-details">
                            <h4>Working logs</h4>
                            <button onClick={() => router.push('/log-date-list')} className="btn-video-recording">Click here to view your working logs</button>
                        </div>
                    )}

                    {/* Wallet Card */}
                    <div className="card-bank-details">
                        <h4>Wallet</h4>
                        <button onClick={() => router.push('/wallet')} className="btn-video-recording">Click here to view your wallet balance</button>
                    </div>

                    {/* Work History Card */}
                    {workHistory.length > 0 && (
                        <div className="card-work-details">
                            <h4>Your history with StudentHub</h4>
                            {workHistory.map((history: CandidateWorkHistory, index: number) => (
                                <div key={index} className="history">
                                    <h5>{history.company && history.company.company_name}</h5>
                                    <p>{`${history.start_date} to ${history.end_date || 'now'}`}</p>
                                </div>
                            ))}
                            <button onClick={downloadCertificate} className="download-btn">Download Certificates</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;