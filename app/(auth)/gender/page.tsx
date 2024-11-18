"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FloatingLabelInput from "@/components/ui/floating-label-input";
import { FormInput } from "@/components/ui/form-input";
import OnboardNav from "@/components/on-board/navigation";
import NeedHelp from "@/components/on-board/need-help";
import SubmitButton from "@/components/ui/submit-button";
import OnboardFooter from "@/components/on-board/layout/footer";
import React, { useState } from "react";
 
 
export default function Name() {
  
  const [gender, setGender] = useState<number | undefined>();

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            What is your gender?
        </h5>
        
        <div className="max-w-[650px] m-auto">
            <div className="flex items-center justify-center">
            
                <button onClick={ () => setGender(1) } className={ `flex-[1_0_0] flex-col xs:me-[8px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${gender == 1? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }

                    `}>
                    Male
                </button>
                <button onClick={ () => setGender(2) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] xs:me-[8px] sm:ms-[16px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${gender == 2? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }
                    `}>
                    Female
                </button>
                <button onClick={ () => setGender(3) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] sm:ms-[16px] px-6 py-5 rounded-2xl border-solid 
                    
                    ${gender == 3? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }

                    `}>
                    Other
                </button>
            </div>

            <SubmitButton disabled={!gender}></SubmitButton>  
        </div>
        <OnboardFooter></OnboardFooter>
    </>
  );
}

