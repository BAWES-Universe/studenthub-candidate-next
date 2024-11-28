"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { useEffect, useState } from "react";
import { setUser } from "@/store/slices/userSlice";
import { errorMessage } from "@/utils/common";
import { profile, updateBirthDate } from "@/providers/logged-in/account.service";
import { useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  candidate_birth_date: z.date().min(new Date(new Date().setFullYear(new Date().getFullYear() - 25)), {
    message: "Candidate age should be between 16 to 25.",
  }).max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), {
    message: "Candidate age should be between 16 to 25.",
  }),
})

export default function Name() {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
   
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidate_birth_date: new Date(user?.candidate_birth_date || ""),
    },
  })

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidate_birth_date', res.candidate_birth_date || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateBirthDate(values.candidate_birth_date.toISOString()).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_birth_date: values.candidate_birth_date.toISOString()
          } }));
        }

        router.push('/gender');
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
            When were you born?
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">
  
          <FormInput 
                  name="candidate_birth_date"
                  label="candidate_birth_date"
                  form={form as any}
                />
          
            <div className="hidden">
              <div className="flex-col ms-[16px] me-[16px]">
                <FormInput 
                  name="day"
                  label="Day"
                  form={form as any}
                />
              </div>
              <div className="flex-col ms-[16px] me-[16px]">
                <FormInput 
                  name="month"
                  label="Month"
                  form={form as any}
                />
              </div>
              <div className="flex-col ms-[16px] me-[16px]">
                <FormInput 
                  name="year"
                  label="Year"
                  form={form as any}
                />
              </div>
            </div>
              
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
