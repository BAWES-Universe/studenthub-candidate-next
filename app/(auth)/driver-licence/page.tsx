"use client"

import { OnboardProgress } from "@/components/on-board/progress";
 
import SubmitButton from "@/components/ui/submit-button";
import OnboardFooter from "@/components/on-board/layout/footer";
import React, { useState } from "react";
 
 
export default function DriverLicence() {
  
  const [haveLicence, setHaveLicence] = useState<number | undefined>();

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

            <SubmitButton disabled={!haveLicence} loading={loading}></SubmitButton>
        </div>
        <OnboardFooter></OnboardFooter>
    </>
  );
}

