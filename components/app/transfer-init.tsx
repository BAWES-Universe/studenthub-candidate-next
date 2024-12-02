import React from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations

const CompensationTransferNotification = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
  const { t } = useTranslation();

  return (
    <div onClick={onClick} className={`card p-4 flex flex-col gap-2 rounded-lg bg-white shadow-md relative`}>
      <h5 className="text-gray-900 font-semibold text-lg leading-7 m-0">
        {t("Compensation Transfer Initiated")}
      </h5>
      <p className="text-gray-600 text-sm leading-4 m-0">
        {t("Your compensation transfer has been initiated. It should be completed within 1-2 business days.")}
      </p>
      <p className="txt-time text-right text-gray-500 text-xs leading-4 m-0">
        {new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      {candidateNotification.is_new && (
        <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 right-4 rounded-full"></span>
      )}
    </div>
  );
};

export default CompensationTransferNotification;