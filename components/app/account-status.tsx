import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { Button } from '../ui/button';
import Link from 'next/link';
import { startWork, stopWork, updateJobSearchStatus } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { errorMessage } from '@/utils/common';
import { Candidate } from '@/models/candidate';

const AccountStatus = () => {
    
    const { t } = useTranslation();
    const [updating, setUpdating] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    const router = useRouter();

    /*useEffect(() => {
        const startWorkSubscription = startWork$.subscribe(() => startWorking());
        const stopWorkSubscription = stopWork$.subscribe(() => stopWorking());
        const workStoppedSubscription = workStopped$.subscribe(() => {
            dispatch(setUser({ user: {
                ...user,
                isWorking: null
            } }));
        });

        return () => {
            startWorkSubscription.unsubscribe();
            stopWorkSubscription.unsubscribe();
            workStoppedSubscription.unsubscribe();
        };
    }, []);*/

    const updateJobSearchStatusClicked = () => {
        const params = {
            job_search_status: user?.candidate_job_search_status === 1 ? 0 : 1
        };

        setUpdating(true);
 
        dispatch(setUser({ user: {
            ...user,
            candidate_job_search_status: params.job_search_status
        } }));

        updateJobSearchStatus(params).then((data: any) => {
            setUpdating(false);
            if (data.operation !== 'success') {
                dispatch(setUser({ user: {
                    ...user,
                    candidate_job_search_status: !params.job_search_status
                } })); // revert status
            }
        }).catch(() => {
            setUpdating(false);
        });
    };

    const viewCompanyDetails = () => {
        router.push(`/company/${user?.company?.company_id}`);
    };
 
    return (
        <div className="account-status">
            <div className="white-bg">
                <h2>{t('Dear')} { transform(user?.candidate_name || '') }</h2>
            </div>
            <div>
                {user?.store ? (
                    <>
                        <p className="txt-job-status" dangerouslySetInnerHTML={{ 
                            __html: t('txt_assigned', { 
                                company: user?.company?.company_name, 
                                store: user?.store?.store_name }) }} />
                        <Button onClick={viewCompanyDetails} className="btn-learn-more">
                            {t('txt_learn_more', { company: user?.company?.company_name })}
                        </Button>
                    </>
                ) : user?.candidate_job_search_status ? (
                    <>
                        <p className="txt-job-status">{
                            t("We’re currently looking for a job for you. We’ll notify you when we find an open position.")}
                        </p>
                        <p className="txt-job-status">{
                            t("The more attractive your profile, the easier it is for us to find you a job.")
                        }</p>
                        <Link href="/profile">
                            <Button className="btn-view-profile">{
                                t("View my profile")
                            }</Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="txt-job-status">{
                        t("You told us you’re not looking for a job, so we’re not going to bother you about it")
                        }</p>
                        <Button className="btn-toggle-job" disabled={updating} onClick={updateJobSearchStatusClicked}>{
                            t("I want a job. Sign me up again.")}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

const transform = (val: string) => {
    return val ? val.split(' ')[0] : '';
};

export default AccountStatus;