// components/App/TransferPaid.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations

const TransferPaid = ({ candidateNotification }: { candidateNotification: any }) => {
    const { t } = useTranslation();

    return (
        <div className={`card p-4 rounded-lg shadow-md bg-white relative`}>
            <h5 className="text-gray-900 font-semibold text-lg">{t("Compensation Transfer Paid")}</h5>
            <p className="text-gray-600 text-sm">
                {t("Congratulations! Your compensation has been transferred to your bank account.")}
            </p>
            <p className="txt-time text-right text-gray-500 text-xs">
                {new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            {candidateNotification.is_new && (
                <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 right-4 rounded-full"></span>
            )}
        </div>
    );
};

TransferPaid.propTypes = {
    candidateNotification: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        is_new: PropTypes.bool.isRequired,
    }).isRequired,
};

export default TransferPaid;

// Tailwind CSS styles are applied directly in the component