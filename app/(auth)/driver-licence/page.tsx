"use client"

import { OnboardProgress } from "@/components/on-board/progress";
 
import SubmitButton from "@/components/ui/submit-button";
import OnboardFooter from "@/components/on-board/layout/footer";
import React from "react";
import { useEffect, useState } from "react";
import { profile, updateDrivingLicense, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";


 
export default function DriverLicence() {
  
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);

  const [haveLicence, setHaveLicence] = useState<number | undefined>(user?.candidate_driving_license || undefined);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log('no haveLicence', haveLicence);
    setHaveLicence(user?.candidate_driving_license || 0);
  }, []);

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        setHaveLicence(res.candidate_driving_license || 0);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  function onSubmit() {

    if (!haveLicence) {
      return;
    }

    setLoading(true);
    updateDrivingLicense(haveLicence).then((res: any) => {
        if (res.operation == 'success') {
          router.push('/personal-photo');
        } else {
          alert(errorMessage(res.message));
        }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            Do you have a driver’s license?
        </h5>
        
        <div className="max-w-[650px] m-auto">
            <div className="flex items-center justify-center">
            
                <button onClick={ () => setHaveLicence(1) } className={ `flex-[1_0_0] flex-col xs:me-[8px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${haveLicence == 1? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }

                    `}>
                    Yes
                </button>
                <button onClick={ () => setHaveLicence(2) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] xs:me-[8px] sm:ms-[16px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${haveLicence == 2 ? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }
                    `}>
                    No
                </button>
            </div>

            <SubmitButton onClick={onSubmit} disabled={!haveLicence || loading} loading={loading}></SubmitButton>
        </div>
        <OnboardFooter></OnboardFooter>
    </>
  );
}

