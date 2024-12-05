// components/App/WorkLog.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { ArrowRight, MoveRight } from 'lucide-react';
import { secondsToTime } from '@/utils/common';
import { format } from 'date-fns';

const WorkLog = ({ hour }: { hour: any }) => {
    const { t } = useTranslation();

    return (
        <div className="ion-card rounded-lg shadow-md bg-white relative">
            <div className="ion-card-content p-4 flex flex-col">
                <p>
                    <b>{hour.end_time ? secondsToTime(hour.total_time) : t("On-Going")}</b>
                    <span>
                        {format(hour.start_time || '', 'hh:mm a')} 
                        <ArrowRight className='inline'  />
                        {hour.end_time 
                            ? format(hour.start_time || '', 'hh:mm a') 
                            : t("Now")}
                    </span>
                </p>

                <p className="txt-meta">
                    {hour.end_time && (
                        <>
                            {hour.status === 0 && <span className="badge warning">{t("Pending")}</span>}
                            {hour.status === 1 && <span className="badge success">{t("Approved")}</span>}
                            {hour.status === 2 && <span className="badge warning">{t("Rejected")}</span>}
                        </>
                    )}
                </p>

                <p>
                    <b>{t("Tracking Method")}:</b>
                    <span>{t(hour.via)}</span>
                </p>
{/*
                <div className="btn-wrapper flex border-t border-gray-300 pt-2 mt-2">
                    <button className="btn-approve" onClick={onApproveClicked}>
                        {t("Approve")}
                    </button>
                    <button className="btn-reject" onClick={onRejectClicked}>
                        {t("Reject")}
                    </button>
                </div> */}
            </div>
        </div>
    );
};

WorkLog.propTypes = {
    hour: PropTypes.shape({
        end_time: PropTypes.string,
        total_time: PropTypes.number.isRequired,
        start_time: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        via: PropTypes.string.isRequired,
    }).isRequired,
   // onApproveClicked: PropTypes.func.isRequired,
   // onRejectClicked: PropTypes.func.isRequired,
};

export default WorkLog;
