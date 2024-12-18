"use client"

declare global {
  interface Window {
    OneSignal: any;
    safari: any;
  }
}

//import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Provider, useDispatch } from "react-redux";
import { store, useAppDispatch } from "@/store/store";
import Script from 'next/script'; 

const inter = Inter({ subsets: ['latin'] });
import NextTopLoader from 'nextjs-toploader'
import { setCampaignId, setCanGoForward, setOneSignalStatus, setPendingInvitations, setPushNotificationAvailable, setShowOneSignalPrompt, setTotalUnreadActity, setTotalUnreadMessages } from "@/store/slices/appSlice";
import { redirect, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { publicRoutes } from "@/_middleware";
import { identify, setMixpanel, track } from "@/providers/analytics.service";
import i18n from "./18n";
import { unreadCount } from "@/providers/logged-in/chat.service";
import { alertCount$, alertUpdate$, error404$, error500$, internetOffline$, setOneSignal$, setOneSignalSubscription$, userLogin$, userLogout$ } from "@/providers/event.service";
import { logout } from "@/store/slices/authSlice";
import { loginByKey } from "@/providers/auth.service";
import { getJobSearchStatus, profile } from "@/providers/logged-in/account.service";
import { setUser } from "@/store/slices/userSlice";
import { clickCampaign } from "@/providers/campaign.service";
import { useAlertDialog } from "@/hooks/use-alert-dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { t } from "i18next";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/
//import { reactI18nextModule } from 'react-i18next';

if (typeof window !== 'undefined') {
  window.onpopstate = (event) => { 
    store.dispatch(setCanGoForward({canGoForward: true}));
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  //const dispatch = useAppDispatch
  
  const state = store.getState(); // Get the state directly from the store

  const { isAuthenticated } = state.auth;  
  const { user } = state.user;
  const { oneSignalStatus } = state.app;

  //useEffect(() => {
  if (typeof window !== 'undefined') {  
    if (!isAuthenticated && !publicRoutes.includes(window?.location.pathname)) {
      return redirect('/login');
    } else if (isAuthenticated && ["/", ""].includes(window?.location.pathname)) {
      return redirect('/home');
    }
  }

  //}, [isAuthenticated, router]);

  let alertSubscription: any = null;
  let notificationScriptLoaded = false;

  useEffect(() => {
    
    //i18n.changeLanguage(language);

    document.getElementsByTagName('html')[0].setAttribute('dir', 
      (i18n.language == 'ar') ? 'rtl' : 'ltr');

    initializeApp();
    
    setMixpanel();
  }, []);

  async function initializeApp() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    if(urlParams.get('auth_key')) {
      loginByKey(urlParams.get('auth_key') + "");
    }

    if(urlParams.get('utm_id')) {
      
      store.dispatch(setCampaignId({
        utm_uuid: urlParams.get('utm_id') +''
      }));
      
      await clickCampaign(urlParams.get('utm_id') + '');
 
      track("From Campaign", {
        "utm_id": urlParams.get('utm_id'),
        "utm_source": urlParams.get('utm_source'),
        "utm_medium": urlParams.get('utm_medium'),
        "utm_campaign": urlParams.get('utm_campaign'),
        "utm_term": urlParams.get('utm_term'),
        "utm_content": urlParams.get('utm_content'),
      });
    }

    if (isAuthenticated && user) {
      identify(user.candidate_id + '', {
        name: user.candidate_name,
        email: user.candidate_email,
      });
    }

    if (isAuthenticated) {
      _updateAlert();
      alertSubscribe();
    }
    
    _includeOneSignalJs();

    error404$.subscribe(data => {
      router.push('/not-found');
    });

    error500$.subscribe(data => {
      router.push('/server-error');
    });

    // Check for network connection
    internetOffline$.subscribe(async () => {
      /*let alert = await this.alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();*/

      router.push('/no-internet');
    });

    error500$.subscribe(userEventData => {
      router.push('/server-error');
    });

    error404$.subscribe(userEventData => {
      router.push('/not-found');
    });

    // On Login Event, set root to Internal app page
    userLogin$.subscribe((data: any) => {

      profile().then(res => {
        store.dispatch(setUser({ user: res }));

        identify(res.candidate_id, {
          name: res.candidate_name,
          email: res.candidate_email,
        });
      });

      oneSignalActionBasedOnStatus();

      _updateAlert();

      alertSubscribe();
    });

    setOneSignal$.subscribe(() => {
      setOneSignalSubscription();
    });

    // On Logout Event, set root to Login Page
    userLogout$.subscribe((logoutReason) => {

      if (alertSubscription) {
        clearInterval(alertSubscription);
        alertSubscription = null;
      }
 
      // unsubscribe from oneSignal

      if (window && window.Notification && window.OneSignal)
      {
        const OneSignal = window.OneSignal;

        OneSignal.isPushNotificationsEnabled((isEnabled: any) => {

          if (isEnabled) {

            // Delete user tags if subscribed

            OneSignal.getUserId().then((userId: any) => {

              if (userId) {

                const tags = [
                  'candidate_id',
                  'name',
                  'email'
                ];

                OneSignal.deleteTags(tags);
              }
            });
          }
        });
      }

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });

    /**
     * Update alert count
     */
    alertUpdate$.subscribe(() => {
      _updateAlert();
    });
  }

  /**
    * Get notification count after every minute
    */
  async function alertSubscribe() {
    if (alertSubscription) {
      return null;
    }

    alertSubscription = setInterval(() => {
      _updateAlert();
    }, 1 * 1000);
  }

  /**
   * Update alert count on app
   */
  async function _updateAlert() {
    unreadCount().then(async data => {

      if (data.operation && data.operation == 'error') {
        /*const toast = await this.toastCtrl.create({
          message: this.translateService.transform('Account deactivated'),
          duration: 3000,
          position: 'top',
          cssClass: 'error_toast_' + this.translateService.direction()
        });
        await toast.present();*/

        store.dispatch(logout());
        router.push("/");    
      } 
      else 
      {
        alertCount$.next(data);

        /*store.dispatch(setPendingInvitations({
          pendingInvitations: data.pendingInvitations
        }));*/

        store.dispatch(setTotalUnreadActity({
          totalUnreadActity: data.totalUnreadActity
        }));

        store.dispatch(setTotalUnreadMessages({
          totalUnreadMessages: data.total,
        }));
      }
    });
  }

  async function loadJobSearchStatus() {

    //loadingJobSearchStatus = true;

    getJobSearchStatus().then(res => {

      store.dispatch(setUser({
        user: {
          ...user,
          candidate_job_search_status: res.candidate_job_search_status
        }
      }));
       
      //this.authService.store = res.store;

      //this.authService.company = (res.parent_company) ? res.parent_company : res.company;

      /*if(!res.isProfileCompleted) {

        this.authService.isProfileCompleted = false;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/complete-profile']);
      }*/
    });
  }

  /**
   * set oneSignal subscription for browser
   */
  async function setOneSignalSubscription() {

    if(window && window.Notification && window.OneSignal)
    {
      const OneSignal = window.OneSignal || [];

      OneSignal.setSubscription(true);
      OneSignal.registerForPushNotifications();

      // send user tag, to target based on tags

      const tags = {
        'candidate_id': user?.candidate_id + '',
        'name': user?.candidate_name,
        'email': user?.candidate_email
      };

      OneSignal.sendTags(tags);
    }

    store.dispatch(setShowOneSignalPrompt({
      showOneSignalPrompt: false
    }));

    store.dispatch(setOneSignalStatus({
      oneSignalStatus: true
    }));
  }

  /**
   * check oneSignal subscription status to show prompt in conversation list page
   */
  async function oneSignalActionBasedOnStatus() {
    if (oneSignalStatus) { // already accepted
      setOneSignalSubscription();
    } else { // not sure
      checkOneSignalStatus();
    } 
  }

  /**
   * check oneSignal subscription status for browser
   */
  async function checkOneSignalStatus() {
  
    if (window && window.OneSignal && window.Notification) {

      const OneSignalw = window.OneSignal || [];

      OneSignalw.isPushNotificationsEnabled((isEnabled: any) => {

        if (isEnabled) {

          // Automatically subscribe user if deleted cookies and browser shows "Allow"

          OneSignalw.getUserId().then((userId: any) => {

            // remove old user tag if any

            if (userId) {

              const tags = [
                'candidate_uuid',
                'name',
                'email'
              ];

              OneSignalw.deleteTags(tags);
            }

            // if (!userId) {

            OneSignalw.setSubscription(true);
            OneSignalw.registerForPushNotifications();

            // send user tag, to target based on tags

            const tags = {
              'candidate_id': user?.candidate_id + '',
              'name': user?.candidate_name,
              'email': user?.candidate_email
            };

            OneSignalw.sendTags(tags);

            // }
          });
        } else {
          store.dispatch(setShowOneSignalPrompt({
            showOneSignalPrompt: true
          }));
        }
      });

      // Occurs when the user's subscription changes to a new value.

      OneSignalw.on('subscriptionChange', (isSubscribed: any) => {
        store.dispatch(setShowOneSignalPrompt({
          showOneSignalPrompt: !isSubscribed
        }));
      });
    }
  }

  /**
   * Include One signal to use stripe element in browser
   */
  async function _includeOneSignalJs() {

    console.log("_includeOneSignalJs");

    if (!window.Notification) {
      console.log("window.Notification not available");
      store.dispatch(setPushNotificationAvailable({
        pushNotificationAvailable: false
      }));
      return null; // only for browser
    }

    /**
     * https://sentry.io/organizations/pogi/issues/1843000885/?project=5339282&referrer=slack
     * Cannot read property 'pushNotification' of undefined
     */

    const agent = window.navigator.userAgent.toLowerCase();
    //agent.indexOf('safari') > -1 && (!window.safari || !window.safari.pushNotification)
    console.log("agent", agent);
    //this.platform.is('ios') 
    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
      console.log("window.Notification not available");
      store.dispatch(setPushNotificationAvailable({
        pushNotificationAvailable: false
      }));
      return null; // ios browser not supporting push notification
    } else {
      store.dispatch(setPushNotificationAvailable({
        pushNotificationAvailable: true
      }));
    }

    // if already loaded, just update tags

    if (window.OneSignal) {
      return oneSignalActionBasedOnStatus();
    }

    // if already initialized

    if (notificationScriptLoaded) {
      return null;
    }

    //setNotificationScriptLoaded(true);
    notificationScriptLoaded = true;

    // load script and call callback to initialize

    const callback = () => {

      const wOneSignal = window.OneSignal || [];

      wOneSignal.push(() => {

        // initialize only on first time script load

        wOneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID,
          safari_web_id: process.env.NEXT_PUBLIC_ONE_SIGNAL_SAFARI_APP_ID,
          autoRegister: false,
          httpPermissionRequest: {
            enable: false
          },
          promptOptions: {
            customlink: {
              enabled: true
            }
          }
        });

        oneSignalActionBasedOnStatus();
      });
    };

    loadScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', callback);
  }
 
  /**
   * Load javascripts dynamically
   * @param url
   * @param callback
   */
  async function loadScript(url: string, callback : () => void = () => {}) {
    const body = document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;

    if (callback) {
      script.addEventListener('load', callback);
    }

    body.appendChild(script);
  }

  const { alertDialogs } = useAlertDialog();

  return (
    <Provider store={store}>
        
      <html lang="en" dir={ i18n.language == "ar"? "rtl": "ltr" }>
        
        <body className={ `${inter.className}` }>
          <NextTopLoader showSpinner={false} />

          <Suspense fallback="loading">
            {children} 
          </Suspense>
          
          <Toaster />

          {/*<AlertDialogs />*/}
          {alertDialogs.map((alertDialog, index) => {
            return (
              <AlertDialog key={index} {...alertDialog}>
                {/**<AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger> */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
                    { alertDialog.description && <AlertDialogDescription>
                    {alertDialog.description}
                    </AlertDialogDescription> }
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/**<AlertDialogCancel>Cancel</AlertDialogCancel> */}
                    <AlertDialogAction>{t('Continue')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          })}


          <Script strategy="lazyOnload" 
            src="https://www.google.com/recaptcha/api.js?render=6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V"></Script>
 
        <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-Q2JP5Y7ZNF"></Script>

        <Script strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5ZHJ48KV');
          `,
            }}
          />
          
        <Script strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-Q2JP5Y7ZNF');
              `,
            }}
          />


        <Script strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:4968508,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
            }}
          />

        </body>
      </html>
    </Provider>
  );
}
