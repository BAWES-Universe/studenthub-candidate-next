"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FloatingLabelInput from "@/components/ui/floating-label-input";
import { FormInput } from "@/components/ui/form-input";
import { PhoneInput } from "@/components/ui/phone-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

const formSchema = z.object({
  phone: z.string()
})

export default function Email() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "+965 ",
    },
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

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          What about your phone number?
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto">

            <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <PhoneInput placeholder=" " {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

            <SubmitButton></SubmitButton>  

          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </>
  );
}
