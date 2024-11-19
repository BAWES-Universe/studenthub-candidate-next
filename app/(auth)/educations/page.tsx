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
  educations: z.array(z.object({
    university: z.string().min(1, 'University is required'),
    degree: z.string().min(1, 'Degree name is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    yearOfGraduation: z.string() //.min(1, 'End year is required'),
  }))
})

export default function Educations() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educations: [{ university: '', degree: '', fieldOfStudy: '', yearOfGraduation: '' }]
    },
  })

  //const { fields, append, remove } = form.control._formValues.educations

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'educations', // Name of the field array
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  } 

  return (
    <div className="mb-[100px]">
      <OnboardProgress />

      <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        Where did you study?
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-">
          {fields?.map((field: { id: string }, index: number) => (
            <div key={field.id} className="space-y-4">
              <FormInput
                name={`educations.${index}.university`}
                label="University"
                form={form as any}
              />

              <FormInput
                    name={`educations.${index}.degree`}
                    label="Degree"
                    form={form as any}
                />

              <div className="flex">
                <div className="flex-1 me-[16px]">
                  <FormInput
                      name={`educations.${index}.fieldOfStudy`}
                      label="Field of Study"
                      form={form as any}
                  />
                </div>  
                <div className="flex-1">
                  <FormInput
                      name={`educations.${index}.yearOfGraduation`}
                      label="Year of Graduation"
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
            onClick={() => append({ university: '', degree: '', fieldOfStudy: '', yearOfGraduation: '' })}
            className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
          >
            
            <img src="/assets/icons/plus.svg" /> Add education
          </Button>

          <SubmitButton />
        </form>
      </Form>

      <OnboardFooter />
    </div>
  )
}
