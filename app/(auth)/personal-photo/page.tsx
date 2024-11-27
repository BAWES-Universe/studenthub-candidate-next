"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { profile, updatePhoneDetail, updateProfilePhoto } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";

const formSchema = z.object({
    candidate_personal_photo: z.string({
        required_error: "Please upload photo."
    }),
})

export default function PersonalPhoto() {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        candidate_personal_photo: user?.candidate_personal_photo || "",
    },
  })

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidate_personal_photo', res.candidate_personal_photo || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    updateProfilePhoto(values.candidate_personal_photo).then(res => {
      if (res.operation == 'success') {

        if (user) {
          user.candidate_personal_photo = res.candidate_personal_photo;
          dispatch(setUser({ user: user }));
        }

        router.push('/about-yourself');
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

        <h5 className="mt-[102px] mb-[8px] text-center text-[40px] font-bold leading-[56px]">
            Show us what you look like
        </h5>
        <p className="mb-[40px] self-stretch text-[#4B4B61] text-center text-base font-normal leading-6">
        Please make sure that your picture is professional, shows your face and is not blurry
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[560px] m-auto">
  
          { form.getValues().candidate_personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed">
                <img src="/assets/icons/logo.svg" alt="" className="w-40 h-40" />
            </div> }

          { !form.getValues().candidate_personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed">
                <img src="/assets/icons/camera.svg" className="w-10 h-10 m-auto mt-[48px]" />
                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center 
                 text-xs font-medium leading-4 block">
                    Upload picture    
                </a>
            </div> }
            
            { form.getValues().candidate_personal_photo && 
                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center m-auto block
                 text-xs font-medium leading-4 mt-[8px]">
                    Upload picture    
                </a> }
 
            <SubmitButton disabled={ !form.getValues().candidate_personal_photo } float={ false } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
