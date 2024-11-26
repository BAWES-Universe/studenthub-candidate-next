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

const formSchema = z.object({
    personal_photo: z.string({
        required_error: "Please upload photo."
    }),
})

export default function PersonalPhoto() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        personal_photo: "1",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
  
          { form.getValues().personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed">
                <img src="/assets/icons/logo.svg" alt="" className="w-40 h-40" />
            </div> }

          { !form.getValues().personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed">
                <img src="/assets/icons/camera.svg" className="w-10 h-10 m-auto mt-[48px]" />
                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center 
                 text-xs font-medium leading-4 block">
                    Upload picture    
                </a>
            </div> }
            
            { form.getValues().personal_photo && 
                <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center m-auto block
                 text-xs font-medium leading-4 mt-[8px]">
                    Upload picture    
                </a> }
 
            <SubmitButton disabled={ !form.getValues().personal_photo } float={ false } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
