"use client"
// app/(dash)/end-session/page.tsx

import { page, track } from '@/providers/analytics.service';
import { CircleX } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook

const EndSessionPage = ({ onClose }: { onClose: any }) => {
  const { t } = useTranslation();

  useEffect(() => {
    page('End session page');

    return () => {
      track('page_exit', { page: 'End session page' });
    }
  }, []);

  return (
   
    <div className="p-6 bg-white">
      <h5 className="text-neutral-95 font-bold text-lg border-b border-gray-300 pb-6 mb-6">
        {t("End Session?")}
      </h5>

      <button className="btn-close absolute right-6 top-4 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
        <CircleX className="text-gray-600 text-xl" />
      </button>

      <p className="text-neutral-90 text-base mb-6">
        {t("Do you want to end and submit this session? you can start more sessions later.")}
      </p>

      <div className="flex">
        <button
          className="btn-end flex items-center justify-center border border-red-500 bg-white text-red-500 rounded-lg h-14 w-full mr-4"
          onClick={() => onClose({ discard: true })}
        >
          {t("End & Discard")}
        </button>

        <button
          className="btn-submit flex items-center justify-center bg-black text-white rounded-lg h-14 w-full"
          onClick={() => onClose({ submit: true })}
        >
          {t("Stop & Submit")}
        </button>
      </div>
    </div>
  );
};

export default EndSessionPage;