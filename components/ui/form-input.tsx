'use client'

import { useId } from 'react'
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from './textarea'
 

interface FormInputProps {
  name: string,
  label: string,
  form: UseFormReturn,
  type?: string,
  helper?: string,
  inputDir?: string
}

export function FormInput({
  name,
  label,
  form,
  type = "text",
  helper,
  inputDir = "ltr"
}: FormInputProps) {
  const id = useId()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative">
          <FormControl>
             
            <Input
              dir={inputDir}
              {...field}
              id={id}
              type={type}
              placeholder=" "  // Empty space needed for peer styling

              className={`peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                placeholder-transparent focus:ring-1
                focus:pt-[32px]
                [&:not(:placeholder-shown)]:pt-[32px]
                ${fieldState.error 
                  ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                  : 'focus:border-primary focus:ring-primary'}`}
            />
          </FormControl>
          <FormLabel 
            htmlFor={id}
            dir={inputDir}
            className={`absolute ${inputDir == "ltr"? 'left-[5px]': 'right-[5px]'} z-10 bg-white px-4 transition-all duration-200
              top-1/2 -translate-y-1/2 scale-100
              text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
              
              
              peer-focus:top-3.5 
              ${inputDir == "ltr"? 'peer-focus:left-[-6px]': 'peer-focus:right-[-6px]' } 
              peer-focus:-translate-y-0 peer-focus:scale-75
              peer-focus:text-[color:var(--Neutral-80,#68687A)] 
              peer-focus:font-medium 
              peer-focus:leading-4
              
              peer-[&:not(:placeholder-shown)]:top-3.5 
              ${inputDir == "ltr"? 'peer-[&:not(:placeholder-shown)]:left-[-6px]': 'peer-[&:not(:placeholder-shown)]:right-[-6px]' }
              peer-[&:not(:placeholder-shown)]:-translate-y-0
              peer-[&:not(:placeholder-shown)]:scale-75
              peer-[&:not(:placeholder-shown)]:text-[color:var(--Neutral-80,#68687A)] 
              peer-[&:not(:placeholder-shown)]:font-medium 
              peer-[&:not(:placeholder-shown)]:leading-4

              ${fieldState.error ? 'text-destructive' : 'text-gray-500 peer-focus:text-primary'}`}
          >
            {label}
          </FormLabel>
          <FormDescription dir="ltr" className='mt-[8px]'>
            { helper }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}