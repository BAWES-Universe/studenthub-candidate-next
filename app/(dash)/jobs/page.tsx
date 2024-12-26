"use client"

import Job from "@/components/app/jobs/job";
import { Suspense } from "react";
import Loading from "./loading";
//import { useTranslation } from "react-i18next";

export default function JobsPage() {
    
   // const { t } = useTranslation();

    let jobs = [1, 2];

    return (
        <Suspense fallback={<Loading />}>  
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    { ('Jobs for you')}
                    </h5>
                </div>    
            </div>
            <div className="max-w-4xl mx-auto p-6">
    
                <div className="mb-2.5 h-[42px] p-[5px] bg-slate-100 rounded-md flex">
                    <div className="cursor-pointer grow shrink basis-0 h-8 px-3 py-1.5 bg-white rounded-[3px] gap-2.5 flex justify-center text-center text-slate-900 text-sm font-medium">
                        Available Positions
                    </div>
                    <div className="cursor-pointer grow shrink basis-0 h-8 px-3 py-1.5 rounded-[3px] gap-2.5 flex justify-center text-center text-slate-700 text-sm font-medium font-['Inter'] leading-tight">
                        Applications
                    </div>
                </div>

                <div className="relative h-10 mb-2.5 w-full self-stretch bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] border border-slate-200">

                    <div className="me-2 my-2.5 absolute start-4 top-[2px]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                        <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 14L11.1 11.1" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        </svg>
                    </div>                        

                    <input type="text" placeholder="Search by job positions..." 
                        className="focus:outline-0 focus:ring-0 w-full self-stretch h-10 gap-2.5 ps-10 pe-4 py-2.5 bg-white rounded-lg text-slate-400 text-sm font-normal leading-tight" />
                        
                </div>

               { jobs.map((job: any) => (
                    <Job job={job} />
               ))} 
            </div>
        </Suspense>
    )
}