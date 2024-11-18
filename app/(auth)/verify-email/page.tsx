"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

const formSchema = z.object({
  c1: z.string({
    required_error: 'Please enter code',
  }),
  c2: z.string({
    required_error: 'Please enter code',
  }),
  c3: z.string({
    required_error: 'Please enter code',
  }),
  c4: z.string({
    required_error: 'Please enter code',
  })
})

export default function Email() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
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
            We’ve sent you a code on your email
        </h5>
        <p className="self-stretch text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] ">
            Please check your email address and type the code here</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">
  
            <div className="flex">
            <FormField 
                    control={form.control}
                    name="c1"
                    render={({ field }) => (
                        <FormItem className="flex-col ms-[16px] me-[16px]">
                            <FormControl>
                                <Input
                                className="flex h-[72px] flex-col justify-center items-center gap-2.5 flex-[1_0_0] border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-0,#FFF)] px-6 py-5 rounded-2xl border-solid"
                                {...field}  
                                />
                            </FormControl> 
                        </FormItem>
                    )}
                    />
                        <FormField 
                    control={form.control}
                    name="c2"
                    render={({ field }) => (
                        <FormItem className="flex-col ms-[16px] me-[16px]">
                            <FormControl>
                                <Input
                                className="flex h-[72px] flex-col justify-center items-center gap-2.5 flex-[1_0_0] border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-0,#FFF)] px-6 py-5 rounded-2xl border-solid"
                                {...field}  
                                />
                            </FormControl> 
                        </FormItem>
                    )}
                    />
                        <FormField 
                    control={form.control}
                    name="c3"
                    render={({ field }) => (
                        <FormItem className="flex-col ms-[16px] me-[16px]">
                            <FormControl>
                                <Input
                                className="flex h-[72px] flex-col justify-center items-center gap-2.5 flex-[1_0_0] border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-0,#FFF)] px-6 py-5 rounded-2xl border-solid"
                                {...field}  
                                />
                            </FormControl> 
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name="c4"
                    render={({ field }) => (
                        <FormItem className="flex-col ms-[16px] me-[16px]">
                            <FormControl>
                                <Input
                                className="flex h-[72px] flex-col justify-center items-center gap-2.5 flex-[1_0_0] border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-0,#FFF)] px-6 py-5 rounded-2xl border-solid"
                                {...field}  
                                />
                            </FormControl> 
                        </FormItem>
                    )}
                    />

            </div>


            <p className="text-[color:var(--Neutral-95,#23233D)] text-sm font-normal leading-5">
                Didn’t receive a code?  &nbsp;
                <a href="/contact" className="no-underline text-primary">
                    Resend Code
                </a>
            </p>

            <SubmitButton></SubmitButton>  
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
