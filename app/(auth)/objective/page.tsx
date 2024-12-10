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
import { profile, updateObjective, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { FormTextarea } from "@/components/ui/form-textarea";
import { page, track } from "@/providers/analytics.service";

const formSchema = z.object({
    objective: z.string({
        required_error: 'Please add introduction note'
    })
})

export default function Objective() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: user?.candidate_objective || "",
    },
  })

  useEffect(() => {

    page('Objective Page');

    return () => {
        track('page_exit', { page: 'Objective Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('objective', res.candidate_objective || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateObjective(values.objective).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_objective: values.objective
          } }));
        }

        if (params && params.get('from-profile'))
          router.push('/profile');
        else
        router.push('/video');
      } else {
        alert(errorMessage(res.message));
      }
    }).finally(() => {
      setLoading(false);
    });
  } 

  return (
    <>
        { !params?.get('from-profile') && <OnboardProgress></OnboardProgress> }

        <h5 className="mt-[102px] mb-[0px] text-center text-[40px] font-bold leading-[56px]">
          What’s your objective?
        </h5>

        <p className="text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] mt-[8px]">
          Tell us a bit about what you hope to achieve
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
            <FormTextarea
              label=""
              name="objective"
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
