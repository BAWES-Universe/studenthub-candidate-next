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
import { useEffect, useState } from "react";
import { profile, updateIntro, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";


const formSchema = z.object({
  candidate_intro: z.string({
        required_error: 'Please add introduction note'
    })
})

export default function AboutYourself() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidate_intro: user?.candidate_intro || "",
    },
  })

  useEffect(() => {
    if (!user) {
      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidate_intro', res.candidate_intro || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateIntro(values.candidate_intro).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_intro: values.candidate_intro
          } }));
        }

        router.push('/objective');
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

        <h5 className="mt-[102px] mb-[0px] text-center text-[40px] font-bold leading-[56px]">
            Tell us about yourself
        </h5>

        <p className="text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] mt-[8px]">
            We know it’s hard, but you can do it!
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">
  
            <Textarea
              name="candidate_intro"
              placeholder="Small brief about yourself"
              form={form as any}
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
