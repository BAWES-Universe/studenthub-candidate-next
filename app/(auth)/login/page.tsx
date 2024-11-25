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
import { setCredentials } from "@/store/slices/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";

const formSchema = z.object({
  email: z.string().email('Please enter valid email address'),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" })
})

export default function Email() {
    const dispatch = useAppDispatch();
    //const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    // After successful login
    dispatch(setCredentials({ 
        user: values, 
        token: 'your-token' 
    }));
  } 

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          What is your email address?
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">
  
          <FormInput
              name="email"
              label="Email Address"
              form={form as any}
              type="email"
            />

            <FormInput
              name="password"
              label="Password"
              form={form as any}
              type="password"
            />
 
            <SubmitButton></SubmitButton>  
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
