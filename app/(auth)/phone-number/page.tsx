"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { PhoneInput } from "@/components/ui/phone-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { useEffect, useState } from "react";
import { profile, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";

const formSchema = z.object({
  phone: z.string()
})

export default function Email() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
   
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: user?.candidate_phone || "",
    },
  })

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('phone', res.candidate_phone || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {

    setLoading(true);

    updatePhoneDetail(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          user.candidate_phone = values.phone;
          dispatch(setUser({ user: user }));
        }

        router.push('/dob');
      } else {
        alert(errorMessage(res.message));
      }
    }).finally(() => {
      setLoading(false);
    });
  } 
 
  const handlePhoneChange = (value: string | undefined) => {
     form.setValue('phone', value || '');
     form.trigger();
  }

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          What about your phone number?
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="relative">
                    <PhoneInput
                      value={form.watch('phone')}
                      onChange={handlePhoneChange}
                      defaultCountry="KW"
                      international
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>

          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
