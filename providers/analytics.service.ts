import { RootState, useAppSelector } from '@/store/store';
import * as mixpanel from 'mixpanel-browser';

declare global {
  interface Window {
    analytics: any;
  }
}

export function setMixpanel() {
  if (process.env.NEXT_PUBLIC_MIXPANEL_KEY)
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY);
}

/**
 * register user
 * @param id 
 * @param params 
 */
export function identify(id: string, params: any) {

  //segment

  if (window.analytics)
    window.analytics.identify(id, {
      name: params.name,
      email: params.email,
    });

  //mixpanel 

  mixpanel.identify(id);

  mixpanel.people.set(params);
}

/**
 * page event
 * @param name 
 */
export function page(name: string) {
  const { language } = useAppSelector((state: RootState) => state.app);


  if (window.analytics)
    window.analytics.page(name);

  /*mixpanel.track("Page View", {
    "name": name
  });*/

  const params = {
    language: language,
    channel: "Candidate Web App",
  }

  mixpanel.track("Page View", {
    "name": name,
    ...params
  });

  // track the elapsed time between a page viewed and page exit
  //call time_event with page_viewed event
  mixpanel.time_event("page_exit");
}

/**
 * custom event
 * @param eventName 
 * @param params 
 */
export function track(eventName: string, params: any) {
  const { language } = useAppSelector((state: RootState) => state.app);

  params.language = language;
  params.channel = "Candidate Web App";

  if (window.analytics)
    window.analytics.track(eventName, params);

  mixpanel.track(eventName, params);
}

export function refreshAnalytics() {
  mixpanel.reset();
}  