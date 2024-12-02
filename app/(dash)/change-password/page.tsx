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

import { useEffect, useState } from "react";
import { updateProfileUrl } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";


const formSchema = z.object({
    oldPassword: z.string({
        required_error: 'Please add old password.'
    }),
    newPassword: z.string({
        required_error: 'Please add new password.'
    })
})

export default function PreferredTime() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateProfileUrl(values).then(res => {
      if (res.operation == 'success') {
        router.push('/profile');
      } else {
        alert(errorMessage(res.message));
      }
    }).finally(() => {
      setLoading(false);
    });
  } 

  useEffect(() => {
    page('Change Password Page');

    return () => {
      track('page_exit', { page: 'Change Password Page' });
    }
  }, []);

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            Change Password
        </h5>
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="oldPassword"
              label="Old Password"
              form={form as any}
              type="text"
            />

          <FormInput
              name="newPassword"
              label="New Password"
              form={form as any}
              type="text"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
