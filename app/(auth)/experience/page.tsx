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

import { useEffect, useState } from "react";
import { profile, updateExperiences, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { saveExperience } from "@/providers/logged-in/candidate-experience.service";

const formSchema = z.object({
  experiences: z.array(z.object({
    candidate_experience_id: z.number().nullable(),
    experience: z.string().max(128).min(1, 'Job title is required'),
    employer: z.string().max(128).nullable(),
    start_year: z.number().min(1900).max((new Date()).getFullYear()).nullable(),
    end_year: z.number().min(1900).max((new Date()).getFullYear()).nullable()
  }))
})

export default function Experiences() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     // experiences: [{ experience: '', employer: '', start_year: '', end_year: '' }]
    },
  })

  useEffect(() => {
    if (user) {

      const formattedExperiences = user.candidateExperiences.map(exp => ({
        candidate_experience_id: exp.candidate_experience_id || null,
        experience: exp.experience,
        employer: exp.employer || null, // Ensure employer is null if undefined
        start_year: exp.start_year || null,
        end_year: exp.end_year || null,
      }));

     form.setValue('experiences', formattedExperiences);
    } else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('experiences', res.candidateExperiences || []);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  //const { fields, append, remove } = form.control._formValues.experiences

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'experiences', // Name of the field array
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    saveExperience(values.experiences).then(res => {
      if (res.operation == 'success') {

        if (user) {
          user.candidateExperiences = res.country.experiences;
          dispatch(setUser({ user: user }));
        }

        router.push('/education-complete');
      } else {
        alert(errorMessage(res.message));
      }
    }).finally(() => {
      setLoading(false);
    });
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
                name={`experiences.${index}.experience`}
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
                    name={`experiences.${index}.start_year`}
                    label="Start Year"
                    form={form as any}
                    type="number"
                />
                </div>  
                <div className="flex-col">
                <FormInput
                    name={`experiences.${index}.end_year`}
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
            onClick={() => append({ candidate_experience_id: null, experience: '', employer: '', start_year: null, end_year: null })}
            className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
          >
            
            <img src="/assets/icons/plus.svg" /> Add experience
          </Button>

          <SubmitButton disabled={!form.formState.isValid || loading }></SubmitButton>
        </form>
      </Form>

      <OnboardFooter />
    </div>
  )
}
