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
import { profile, updatePhoneDetail, updatePreferredTime, updateProfileUrl } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { resetPasswordRequest } from "@/providers/auth.service";


declare let grecaptcha: any;

const formSchema = z.object({
  email: z.string({
    required_error: 'Please add email address.'
    })
})

export default function PreferredTime() {

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    grecaptcha.ready(() => {
        grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {
           
            resetPasswordRequest(values.email, token).then(res => {
                if (res.operation == 'success') {
 
                    alert(res.message);//'Password recovery email sent, please check your email.'
                    router.push('/login');
                } else {
                    alert(errorMessage(res.message));
                }
            }).finally(() => {
                setLoading(false);
            });
        });
    });
  } 

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            Forgot your password?
        </h5>
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="email"
              label="Email Address"
              form={form as any}
              type="email"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
