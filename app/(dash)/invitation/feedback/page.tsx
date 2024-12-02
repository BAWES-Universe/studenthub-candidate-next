// app/(dash)/invitation/FeedbackPage.jsx

import { page, track } from '@/providers/analytics.service';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Invitation } from '@/models/invitation';
import { accept } from '@/providers/logged-in/invitation.service';
import { reject } from '@/providers/logged-in/invitation.service';
import { requestUpdated$ } from '@/providers/event.service';

const FeedbackPage = ({ invitation, onClose }: { invitation: Invitation, onClose: (value: boolean) => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        page('Invitation Feedback page');
        return () => {
            track('page_exit', { 'page': 'Invitation Feedback page' });
        };
    }, []);

    const onSubmit = async (data: any) => {

        if (!invitation) {
            return;
        }

        setLoading(true);
        try {
            let action;
            if (invitation.invitation_status === 2) {
                action = await reject(invitation.invitation_uuid || "", data.reason);
            } else {
                action = await accept(invitation.invitation_uuid || "", data.reason);
            }

            requestUpdated$.next({});
            if (action.operation === 'success') {
                onClose(true);
            } else {
                alert(t('Try Again'));
            }
        } catch (error) {
            alert(t('An error occurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button onClick={() => onClose(false)} className="btn-close">
                <img src="assets/images/ic_cancel.svg" alt="Close" />
            </button>

            <div className="title-txt">
                {invitation.invitation_status === 3 ? t("Why do you think you’d be good for this job?") : t("Why do you feel that this job isn’t good for you?")}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                    placeholder={t('Speak your mind')}
                    {...register('reason', { required: true })}
                    className={`border-4 rounded-lg p-2 w-full ${errors.reason ? 'border-red-500' : 'border-gray-400'}`}
                />
                {errors.reason && <span className="text-red-500">This field is required</span>}

                <button type="submit" disabled={!loading} className="btn-submit">
                    {loading ? <span>Loading...</span> : (invitation.invitation_status === 2 ? t("Reject") : t("Apply"))}
                </button>
            </form>
        </div>
    );
};

export default FeedbackPage;