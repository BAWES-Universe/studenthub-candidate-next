"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { profile, updateCivilIdAndExpiryDate, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";


const formSchema = z.object({
  candidate_civil_photo_back: z.string({
        required_error: 'Please upload back side of your national id.'
    }),
  candidate_civil_photo_front: z.string({
        required_error: 'Please upload front side of your national id.'
    }),
  candidate_civil_expiry_date: z.date({
    }),
    candidate_civil_id: z.string({
        //required_error: 'Please add id number.'
    })
})

export default function PreferredTime() {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidate_civil_id', res.candidate_civil_id || "");
        form.setValue('candidate_civil_expiry_date', res.candidate_civil_expiry_date || "");
        form.setValue('candidate_civil_photo_back', res.candidate_civil_photo_back || "");
        form.setValue('candidate_civil_photo_front', res.candidate_civil_photo_front || "");
      
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        candidate_civil_id: user?.candidate_civil_id || "",
        candidate_civil_expiry_date: new Date(user?.candidate_civil_expiry_date || ""),
        candidate_civil_photo_back: user?.candidate_civil_photo_back,
        candidate_civil_photo_front: user?.candidate_civil_photo_front,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    //todo: new api to upload both  
    updateCivilIdPhotos(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          user.candidate_civil_id = values.candidate_civil_id;
          user.candidate_civil_expiry_date = values.candidate_civil_expiry_date.toISOString();
          user.candidate_civil_photo_back = values.candidate_civil_photo_back;
          user.candidate_civil_photo_front = values.candidate_civil_photo_front;  
          dispatch(setUser({ user: user }));
        }

        router.push('/preferred-time');
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

        <h5 className="text-[color:var(--Neutral-100,#0F0F2C)] text-center 
         text-[40px] font-bold leading-[56px] mt-[102px] mb-[38px]">
            Civil ID Information
        </h5>
  { /**block-inline max-w-[313px] xs:max-w-full xs:w-full  */}

       <div className="flex flex-col sm:flex-row max-w-[640px]  min-h-[196px] m-auto mb-[24px]">
            { !form.getValues().candidate_civil_photo_front && <div className="xs:max-w-full sm:max-w-[313px]  flex-none text-center py-[24px] px-[46px] shrink-0 border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-2xl border-[1.333px] border-dashed mb-[24px] sm:mb-0 sm:me-[24px]">

                <img src="/assets/icons/id-front.svg" className="m-auto"></img>   

                <h6 className="self-stretch text-[color:var(--Neutral-95,#23233D)] text-center 
                    text-base font-semibold leading-6 mt-[8px] mb-[4px] block">
                    ID Photo (Front)</h6> 

                <p className="self-stretch text-[#4B4B61] text-center text-sm font-normal leading-5 mt-[4x] block">
                    Make sure the image is bright and not blurry
                </p>

                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)]  text-xs font-medium leading-4 mt-[16px] block">
                    Upload ID Front
                </a>
            </div> }

            { form.getValues().candidate_civil_photo_front && <div className="xs:max-w-full w-full sm:max-w-[313px]  flex-none 
                  rounded-2xl mb-[24px] sm:mb-0 sm:me-[24px]">

                <img src="/assets/icons/logo.svg" className="w-full"></img>   

                <Button variant={ "ghost"}  className="text-[color:var(--Neutral-70,#7D7D8D)] text-sm font-medium leading-5 text-center m-auto mt-[12px]">
                    <img src="/assets/icons/trash.svg" className="w-[16px]"></img>    Remove 
                </Button>
            </div> }
            
            { !form.getValues().candidate_civil_photo_back && <div className="xs:max-w-full sm:max-w-[313px] flex-none text-center py-[24px] px-[46px] shrink-0 border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-2xl border-[1.333px] border-dashed">

                <img src="/assets/icons/id-back.svg" className="m-auto"></img>   

                <h6 className="self-stretch text-[color:var(--Neutral-95,#23233D)] text-center 
                    text-base font-semibold leading-6  mt-[8px] mb-[4px] block">
                    ID Photo (Back)</h6> 

                <p className="self-stretch text-[#4B4B61] text-center text-sm font-normal leading-5 mt-[4x] block">
                    Make sure the image is bright and not blurry
                </p>

                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center text-xs font-medium leading-4 mt-[16px] block">
                    Upload ID Back
                </a>
            </div> }


            { form.getValues().candidate_civil_photo_back && <div className="xs:max-w-full sm:max-w-[313px] w-full flex-none 
                  rounded-2xl mb-[24px] sm:mb-0">

                <img src="/assets/icons/logo.svg" className="w-full"></img>   

                <Button variant={ "ghost"}  className="text-[color:var(--Neutral-70,#7D7D8D)] text-sm font-medium leading-5 text-center m-auto mt-[12px]">
                    <img src="/assets/icons/trash.svg" className="w-[16px]"></img>    Remove 
                </Button>
            </div> }
            
        </div> 
    
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[16px] max-w-[650px] m-auto mb-[100px]">
  
          <p className="self-stretch text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7">
            ID Details
          </p>

          <FormInput
              name="candidate_civil_id"
              label="ID Number"
              form={form as any}
              type="text"
            />
{ /* todo: have date field*/ }

           <FormInput
              name="candidate_civil_expiry_date"
              label="Expiry Date"
              form={form as any}
              type="date"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter ></OnboardFooter>
    </>
  );
}
