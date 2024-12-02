// app/(dash)/log-time-manually/page.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { useForm } from 'react-hook-form'; // Assuming you're using react-hook-form for form handling
import { addWorkingHour } from '@/providers/logged-in/candidate-working-hour.service';
import { CircleX, X } from 'lucide-react';
import Spinner from '@/components/common/spinner';
import { page, track } from '@/providers/analytics.service';

const LogTimeManuallyPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [saving, setSaving] = useState(false);
  const minDate = '1980-01-01';
  const maxDate = new Date().toISOString();

  useEffect(() => {
    // Analytics tracking
    
    page('Log Time Manually Page');

    return () => {
      track('page_exit', { page: 'Log Time Manually Page' });
    }
  }, []);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const response = await addWorkingHour(data);
    setSaving(false);

    if (response.operation === "success") {
      //Alert.alert(t('Success'), response.message);
      reset(); // Reset the form
    } else if (response.operation === "error") {
      //Alert.alert(t('Error'), response.message);
      alert(response.message);
    }
  };

  const selectDate = async () => {
    // Logic to open DatePickerComponent and set the selected date
    const selectedDate = await openDatePicker(); // Implement this function
    if (selectedDate) {
      setValue('date', selectedDate);
      setValue('dateFormatted', selectedDate); // Assuming you have a formatted version
    }
  };

  const selectStartTime = async () => {
    // Logic to open TimePickerComponent and set the selected start time
    const selectedTime = await openTimePicker(); // Implement this function
    if (selectedTime) {
      setValue('start_time', selectedTime);
    }
  };

  const selectEndTime = async () => {
    // Logic to open TimePickerComponent and set the selected end time
    const selectedTime = await openTimePicker(); // Implement this function
    if (selectedTime) {
      setValue('end_time', selectedTime);
    }
  };

  const close = () => {
    // Close modal logic
  };

  const openDatePicker = () => {
    // Open date picker logic
    return '2024-01-01';
  };

  const openTimePicker = () => {
    // Open time picker logic
    return '10:00';
  };

  return (
    <div className="p-6 bg-white">
      <h5 className="text-lg font-bold mb-4">{t("Log Time")}</h5>
      <button className="btn-close" onClick={() => {/* Close modal logic */}}>
        <X className="text-gray-600 text-xl" />
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">{t("Check-in")}</label>
            <input
              type="time"
              {...register('start_time', { required: true })}
              className="border rounded p-2 w-full"
              onClick={selectStartTime}
            /> 
          </div>
          <div>
            <label className="block text-sm font-medium">{t("Check-out")}</label>
            <input
              type="time"
              {...register('end_time', { required: true })}
              className="border rounded p-2 w-full"
              onClick={selectEndTime}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">{t("Notes")}</label>
          <textarea
            {...register('note', { required: true })}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">{t("Select Date")}</label>
          <input
            type="date"
            readOnly
            {...register('dateFormatted', { required: true })}
            className="border rounded p-2 w-full"
            onClick={selectDate}
          />
        </div>

        <button
          type="submit"
          className="btn-submit w-full"
          disabled={saving}
        >
          {saving ? <Spinner /> : t("Submit Time")}
        </button>
      </form>
    </div>
  );
};

export default LogTimeManuallyPage;