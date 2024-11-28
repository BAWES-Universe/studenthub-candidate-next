"use client";

import { OnboardProgress } from "@/components/on-board/progress";
 
import SubmitButton from "@/components/ui/submit-button";
import OnboardFooter from "@/components/on-board/layout/footer";
import React from "react";
import { useEffect, useState } from "react";
import { profile, updateGender } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
 
 
export default function Name() {
  
    
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { user } = useAppSelector(state => state.user);
  
  const [gender, setGender] = useState<number>(user?.candidate_gender || 0);
  const [loading, setLoading] = useState(false);
 
   
  useEffect(() => {
      
    if (!user) {
      
      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        setGender(res.candidate_gender);
        console.log('gender', gender);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  useEffect(() => {
    setGender(user?.candidate_gender || 0);
  }, []);

  function onSubmit() {
    console.log('gender', gender);
    if (gender) {
      updateGender(gender).then(res => {
        if (res.operation == 'success') {

          dispatch(setUser({ user: {
            ...user,
            candidate_gender: gender
          } }));

          router.push('/nationality');
        } else {
          alert(errorMessage(res.message));
        }
      });
    }
  }
  
  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            What is your gender?
        </h5>
        
        <div suppressHydrationWarning={true} className="max-w-[650px] m-auto">
            <div className="flex items-center justify-center">
            
                <button onClick={ () => setGender(1) } className={ `flex-[1_0_0] flex-col xs:me-[8px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${ gender == 1 ? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)' }

                    `}>
                    Male
                </button>
                <button onClick={ () => setGender(2) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] xs:me-[8px] sm:ms-[16px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${gender == 2 ? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)' }
                    `}>
                    Female
                </button>
                <button onClick={ () => setGender(3) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] sm:ms-[16px] px-6 py-5 rounded-2xl border-solid 
                    
                    ${gender == 3 ? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)' }

                    `}>
                    Other
                </button>
            </div>

            <SubmitButton onClick={onSubmit}  
              loading={loading}></SubmitButton>
        </div>
        <OnboardFooter></OnboardFooter>
    </>
  );
}

