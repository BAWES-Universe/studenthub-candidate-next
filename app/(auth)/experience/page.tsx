"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  experiences: z.array(z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    employer: z.string().min(1, 'Employer name is required'),
    startYear: z.string().min(1, 'Start year is required'),
    endYear: z.string() //.min(1, 'End year is required'),
  }))
})

export default function Experiences() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences: [{ jobTitle: '', employer: '', startYear: '', endYear: '' }]
    },
  })

  //const { fields, append, remove } = form.control._formValues.experiences

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'experiences', // Name of the field array
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  } 

  return (
    <div className="mb-[100px]">
      <OnboardProgress />

      <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        Do you have any work experience?
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-">
          {fields?.map((field: { id: string }, index: number) => (
            <div key={field.id} className="space-y-4">
              <FormInput
                name={`experiences.${index}.jobTitle`}
                label="Job Title"
                form={form as any}
              />

              <div className="flex">
                <div className="flex-col me-[16px]">
                <FormInput
                    name={`experiences.${index}.employer`}
                    label="Employer"
                    form={form as any}
                />
                </div>  
                <div className="flex-col me-[16px]">
                <FormInput
                    name={`experiences.${index}.startYear`}
                    label="Start Year"
                    form={form as any}
                    type="number"
                />
                </div>  
                <div className="flex-col">
                <FormInput
                    name={`experiences.${index}.endYear`}
                    label="End Year"
                    form={form as any}
                    type="number"
                />
                </div>  
              </div>

              {fields.length > 1 && (
                
                    <Button
                        variant={'ghost'}
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                        >
                        Remove 
                    </Button>)
               }

               {index != fields.length -1 && (
                    <div className="w-[114px] h-0.5 [background:var(--Neutral-40,#E2E2E6)] rounded-[1px] m-auto"></div>
                ) 
               }
            </div>
          ))}
          
          <Button
            variant={'ghost'}
            type="button"
            onClick={() => append({ jobTitle: '', employer: '', startYear: '', endYear: '' })}
            className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
          >
            
            <img src="/assets/icons/plus.svg" /> Add experience
          </Button>

          <SubmitButton />
        </form>
      </Form>

      <OnboardFooter />
    </div>
  )
}
