'use client'

import { useId } from 'react'
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker';
import './assets/css/datepicker.css'; // Import the default styles


interface FormInputProps {
  name: string,
  label: string,
  form: UseFormReturn,
  helper?: string,
  inputDir?: string,
  onFocus?: () => void,
  onChange?: (date: any) => void
}

export function FormDateInput({
  name,
  label,
  form,
  helper,
  inputDir = "ltr",
  onFocus,
  onChange
}: FormInputProps) {
  const id = useId()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        
        <FormItem className="relative">
          <div className="relative">
            <FormControl>             
                  <DatePicker
                    selected={field.value}
                    onChange={(date: any) => {
                      form.setValue(name, date);
                      form.trigger(name);

                      onChange && onChange(date)
                    }}
                    dateFormat="MMMM d, yyyy"
                    className={ `
                      flex border bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                 
                      peer h-[72px] py-[16px] px-[24px]  w-full 
                      border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                       focus:ring-1
                      
                      [&:not(:placeholder-shown)]:pt-[32px]
                      
                      ${fieldState.error 
                      ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                      : 'focus:border-primary focus:ring-primary'}` }
                    placeholderText="Select date"
                    popperClassName="z-10" // Ensure the datepicker is above other elements
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                      <div className="flex justify-between items-center p-2">
                        <button onClick={decreaseMonth} className="text-gray-500 hover:text-gray-700">
                          {'<'}
                        </button>
                        <span className="font-bold">{format(date, 'MMMM yyyy')}</span>
                        <button onClick={increaseMonth} className="text-gray-500 hover:text-gray-700">
                          {'>'}
                        </button>
                      </div>
                    )}
                  />
                  { /*field.value && (
                    <div className="absolute top-0 left-0 mt-2 ">
                      {format(field.value, 'PPP')}
                    </div>
                  )*/}
            </FormControl>     
            <FormLabel 
                htmlFor={id}
                dir={inputDir}
                className={`absolute z-10 bg-white px-[24px] transition-all duration-200
                top-1/2 -translate-y-1/2 scale-100
                text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                
                ${inputDir == "ltr"? 'left-[7px] peer-focus:left-[6px] peer-[&:not(:placeholder-shown)]:left-[6px] origin-[0]': 'right-[6px] peer-focus:right-[6px] peer-[&:not(:placeholder-shown)]:right-[6px] origin-[100%]'}

                peer-focus:top-3.5 
                
                peer-focus:-translate-y-0 peer-focus:scale-75
                peer-focus:text-[color:var(--Neutral-80,#68687A)] 
                peer-focus:font-medium 
                peer-focus:leading-4
                
                peer-[&:not(:placeholder-shown)]:top-3.5 
                peer-[&:not(:placeholder-shown)]:-translate-y-0
                peer-[&:not(:placeholder-shown)]:scale-75
                peer-[&:not(:placeholder-shown)]:text-[color:var(--Neutral-80,#68687A)] 
                peer-[&:not(:placeholder-shown)]:font-medium 
                peer-[&:not(:placeholder-shown)]:leading-4

                
                ${field.value? 'top-3.5 -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4': 'hidden'}

                ${fieldState.error ? 'text-destructive' : 'text-gray-500 peer-focus:text-primary'}`}
            >
                {label}
            </FormLabel>
          </div>
          <FormDescription dir="ltr" className='mt-[8px]'>
            { helper }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}