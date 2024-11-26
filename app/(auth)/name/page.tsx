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
import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from 'next/navigation'; 

const formSchema = z.object({
  name_en: z.string().min(2, {
    message: "Name in English must be at least 2 characters.",
  }),
  name_ar: z.string().min(2, {
    message: "Name in Arabic must be at least 2 characters.",
  }),
})

export default function Name() {

  const dispatch = useAppDispatch();
  const router = useRouter()

  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    //setLoading(true); 

    dispatch(setUser({
      user: {
        candidate_name: values.name_en,
        candidate_name_ar: values.name_ar,
      }
    }));

    router.push("/email");
  } 

  return (
    <>
        <OnboardProgress></OnboardProgress>

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            What’s your name, hero?
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">
  
            <FormInput
              name="name_en"
              label="Name in English"
              form={form as any}
            />
 
            <FormInput 
              name="name_ar"
              label=" الإسم بالعربي"
              form={form as any}
              helper="It should match what’s on your civil ID."
              inputDir="rtl"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading }>
            </SubmitButton>  
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
