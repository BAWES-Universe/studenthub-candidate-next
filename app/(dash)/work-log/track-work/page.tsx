"use client"
// app/(dash)/track-work/page.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { Geolocation } from '@capacitor/geolocation'; // Assuming you're using Capacitor for geolocation
import { ChevronRight } from 'lucide-react';
import { secondsToTime } from '@/utils/common';
import { CandidateWorkingHour } from '@/models/candidate';
import { checkWorkStatus, startWork, stopWork, discardSession } from '@/providers/logged-in/account.service';
import { listHours } from '@/providers/logged-in/candidate-working-hour.service';
import LogTimeManuallyPage from '../log-time-manually/page';
import EndSessionPage from '../end-session/page';
import Spinner from '@/components/common/spinner';
import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';

const TrackWorkPage = () => {
  const { t } = useTranslation();
  const [started, setStarted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [startingWork, setStartingWork] = useState(false);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0
  });

  const [candidateWorkingHourData, setCandidateWorkingHourData] = useState([]);
  const [today, setToday] = useState(new Date());
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Check if user is working and load initial data
    loadInitialData();

    page('Track Work Page');

    return () => {
      track('page_exit', { page: 'Track Work Page' });
    }
  }, []);

  const loadInitialData = async () => {
    // Load user work status, sessions, and stats
    await checkStatus();
    await loadSessions();
    await loadStats();
  };

  const checkStatus = async () => {
    const data = await checkWorkStatus();
    if (data) {
      setStarted(data.start_time);
    }
  };

  const loadStats = async () => {
    const response = await stats(getUrlParams());
    setStats(response);
  };

  const loadSessions = async (page = 1) => {
    setLoading(true);
    const response = await listHours(page, getUrlParams());

    setPagination({
      current_page: parseInt(response.headers.get('X-Pagination-Current-Page')),
      total_pages: parseInt(response.headers.get('X-Pagination-Page-Count')),
      total_count: parseInt(response.headers.get('X-Pagination-Total-Count')),
    });

    setCandidateWorkingHourData(response.data);
    setLoading(false);
  };

  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadSessions(page);
  }

  const getUrlParams = () => {
    return `&date=${today.toISOString().split('T')[0]}`; // Format date as YYYY-MM-DD
  };

  const handleRefresh = async () => {
    await checkStatus();
    await loadSessions();
    await loadStats();
  };

  const toggleTrack = () => {
    if (started) {
      confirmStopWork();
    } else {
      startWorkClicked();
    }
  };

  const startWorkClicked = async () => {
    setStartingWork(true);
    const resp = await Geolocation.getCurrentPosition();
    if (resp && resp.coords) {
      const data = await startWork(resp.coords.latitude, resp.coords.longitude);
      if (data.operation === "success") {
        setStarted(data.data);
        await loadStats();
      }
    }
    setStartingWork(false);
  };

  const stopWorkClicked = async () => {
    setSavingHours(true);
    const resp = await Geolocation.getCurrentPosition();
    if (resp && resp.coords) {
      await stopWork(resp.coords.latitude, resp.coords.longitude);
      setStarted(null);
      await loadSessions();
      await loadStats();
    }
    setSavingHours(false);
  };

  const confirmStopWork = async () => {
    // todo: Logic to open EndSessionPage modal
    const result: any = await openModal(EndSessionPage);
    if (result && result.submit) {
      await stopWorkClicked();
    } else if (result && result.discard) {
      discardSessionClicked();
    }
  };

  const discardSessionClicked = async () => {
    await discardSession();
    setStarted(null);
  };

  const addManually = async () => {
    //todo: open modal
    const result: any = await openModal(LogTimeManuallyPage);
    if (result && result.refresh) {
      await loadSessions();
      await loadStats();
    }
  };

  const openModal = async (Component: any) => {
    // Logic to open modal and return result
  };

  return (
    <div className="p-6">
      <div className="current-datetime">
        <b className="time">{today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b>
        <br />
        <span className="date">{today.toLocaleDateString()}</span>
      </div>

      <div className="btn-wrapper">
        <button
          disabled={savingHours || startingWork}
          className={`btn-track ${started ? 'btn-track-tracking' : ''}`}
          onClick={toggleTrack}
        >
          {savingHours || startingWork ? <Spinner /> : null}
          {!savingHours && !startingWork && !started && <span>{t("Start Tracking")}</span>}
          {started && <span className="end">{t("End Tracking")}</span>}
        </button>
      </div>

      <button className="btn-manual" onClick={addManually}>
        {t("Manual Logging")}
        <ChevronRight className="text-gray-600 text-xl" />
      </button>

      { stats && <div className="stats">
        <div>
          <b>{stats?.checkIn ? new Date(stats.checkIn).toLocaleTimeString() : '00:00'}</b>
          <span>{t("Check-in")}</span>
        </div>
        <div>
          <b>{stats?.checkOut ? new Date(stats.checkOut).toLocaleTimeString() : '00:00'}</b>
          <span>{t("Check-out")}</span>
        </div>
        <div>
          <b>{stats?.totalTime ? secondsToTime(stats.totalTime) : '00:00'}</b>
          <span>{t("Total hours")}</span>
        </div>
      </div> }

      <div className="session-wrapper" style={{ marginTop: '24px' }}>
        <h5 className="txt-session-heading">{t("Sessions")} <span>({pagination.total_count})</span></h5>
        {candidateWorkingHourData.map((hour: CandidateWorkingHour) => (
          <p key={hour.candidate_working_hour_uuid}>
            <b>{ hour.total_time && secondsToTime(hour.total_time)}</b>
            <span>
              { hour.start_time ? (new Date(hour.start_time))?.toLocaleTimeString() : '00:00'} 
              <ChevronRight className="text-gray-600 text-xl" />
              { hour.end_time ? (new Date(hour.end_time))?.toLocaleTimeString() : '00:00'}
            </span>
          </p>
        ))}

        <Pager pagination={pagination} loadPage={loadPage} />

      </div>
    </div>
  );
};

export default TrackWorkPage;