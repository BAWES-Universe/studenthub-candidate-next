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
import { profile, updatePhoneDetail } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { saveEducation, updateEducation } from "@/providers/logged-in/candidate-education.service";
import UniversityInput from "@/components/on-board/university-input";
import DegreeGroupInput from "@/components/on-board/degree-group";
import DegreeInput from "@/components/on-board/degree-input";
import MajorInput from "@/components/on-board/major-input";


const formSchema = z.object({
  candidateEducations: z.array(z.object({
    university: z.any(),
    degree: z.any(),
    fieldOfStudy: z.any(),

    education_uuid: z.string().nullable(),
    graduation_year: z.number().min(1900).max((new Date()).getFullYear()).nullable(), //.min(1, 'End year is required'),
    university_id: z.number().min(1, "University is required"),
    degree_uuid: z.string(),
    major_uuid: z.string(),
    is_currently_studying: z.boolean(),
  }))
})

export default function Educations() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //candidateEducations: user?.candidateEducations || []
    },
  })

  useEffect(() => {
    if (user) {

      const formattedEducations = user.candidateEducations.map(edu => ({
        education_uuid: edu.education_uuid || null,
        university_id: edu.university.university_id,
        degree_uuid: edu.degree.degree_uuid,
        major_uuid: edu.major.major_uuid,
        graduation_year: edu.graduation_year,
        is_currently_studying: edu.is_currently_studying,

        university: edu.university,
        degree: edu.degree,
        fieldOfStudy: edu.major,
      }));

     form.setValue('candidateEducations', formattedEducations || []);
    } else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidateEducations', res.candidateEducations || []);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  //const { fields, append, remove } = form.control._formValues.candidateEducations

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'candidateEducations', // Name of the field array
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    setLoading(true);

    saveEducation(values.candidateEducations).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidateEducations: res.candidateEducations
          } }));
        }

        router.push('/skills');
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
        Where did you study?
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-">
          {fields?.map((field: { id: string }, index: number) => (
            <div key={field.id} className="space-y-4">

              <UniversityInput 
                university_id={form.getValues(`candidateEducations.${index}.university_id`)}
                onSelect={(university: any) => {
                  form.setValue(`candidateEducations.${index}.university_id`, university.university_id);
                }}></UniversityInput>  
 
              { /*
              <DegreeGroupInput 
                degree_group_uuid={form.getValues(`candidateEducations.${index}.degree_group_uuid`)}
                onSelect={(degreeGroup: any) => {
                  form.setValue(`candidateEducations.${index}.university_id`, university.university_id);
                }}></DegreeGroupInput>  */ }

              <DegreeInput 
                degree_uuid={form.getValues(`candidateEducations.${index}.degree_uuid`)}
                onSelect={(degree: any) => {
                  form.setValue(`candidateEducations.${index}.degree_uuid`, degree.degree_uuid);
                }}></DegreeInput>  
 
              <div className="flex">
                <div className="flex-1 me-[16px]">
                  <MajorInput 
                    major_uuid={form.getValues(`candidateEducations.${index}.major_uuid`)}
                    onSelect={(major: any) => {
                      form.setValue(`candidateEducations.${index}.major_uuid`, major.major_uuid);
                    }}></MajorInput>  
                </div>  
                <div className="flex-1">
                  <FormInput
                      name={`candidateEducations.${index}.graduation_year`}
                      label="Year of Graduation"
                      form={form as any}
                      type="number"
                  />
                </div>  
              </div>




              <FormInput
                    name={`candidateEducations.${index}.degree`}
                    label="Degree"
                    form={form as any}
                />

              <div className="flex">
                <div className="flex-1 me-[16px]">
                  <FormInput
                      name={`candidateEducations.${index}.fieldOfStudy`}
                      label="Field of Study"
                      form={form as any}
                  />
                </div>  
                <div className="flex-1">
                  <FormInput
                      name={`candidateEducations.${index}.graduation_year`}
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
            onClick={() => append({ university: '', degree: '', fieldOfStudy: '', graduation_year: null, education_uuid: null, university_id: 0, degree_uuid: '', major_uuid: '', is_currently_studying: false })}
            className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
          >
            
            <img src="/assets/icons/plus.svg" /> Add education
          </Button>

          <SubmitButton disabled={!form.formState.isValid || loading }></SubmitButton>
        </form>
      </Form>

      <OnboardFooter />
    </div>
  )
}
