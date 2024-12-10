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
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setIsProfileCompleted, setUser } from "@/store/slices/userSlice";
import { resetPasswordRequest, updatePassword } from "@/providers/auth.service";
import { setCredentials } from "@/store/slices/authSlice";
import { page, track } from "@/providers/analytics.service";


declare let grecaptcha: any;

const formSchema = z.object({
  password: z.string({
    required_error: 'Please add new password.'
  })
})

export default function UpdatePasswordPage() {

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const params = useParams();

  const token: string = params?.token as string;
 
  const sparams = useSearchParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        password: "",
    },
  })

  useEffect(() => {

    page('Update Password Page');

    return () => {
        track('page_exit', { page: 'Update Password Page' });
    }
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

   // grecaptcha.ready(() => {
   //     grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {
           
            updatePassword(values.password, token).then(res => {
                if (res.operation == 'success') {
 
                    alert(res.message);//'Password recovery email sent, please check your email.'
                    
                    dispatch(setCredentials({
                        token: res.accessToken.token
                      }));
                
                      dispatch(setIsProfileCompleted({ 
                        isProfileCompleted: res.accessToken.isProfileCompleted
                      }));

                    router.push('/home');
                } else {
                    alert(errorMessage(res.message));
                }
            }).finally(() => {
                setLoading(false);
            });
    //    });
   // });
  } 

  return (
    <>
        { !sparams?.get('from-profile') && <OnboardProgress></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        Type your new password
        </h5>
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="password"
              label="Password"
              form={form as any}
              type="password"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
