import OnboardFooter from "@/components/on-board/layout/footer";
import { Button } from "@/components/ui/button";
import { page, track } from "@/providers/analytics.service";
import Link from "next/dist/client/link";
import { useEffect } from "react";

export default function PersonalInfoComplete() {

    useEffect(() => {

        page('Personal Info Page');

        return () => {
            track('page_exit', { page: 'Personal Info Page' });
        }
    }, []);

    return (
        <div className="flex  min-h-screen flex-col items-center  text-center px-4 p-[16px]">

            <div className="w-[240px] h-[240px] bg-[#f9f9f9] rounded-[118px] flex justify-center items-center mb-[40px] xs:mt-[87px] sm:mt-[40px]">
                <img alt="" src="/assets/icons/man.svg" className="w-[128px] h-[128px]" />
            </div>

            
            <h5 className="self-stretch text-[color:var(--Neutral-100,#0F0F2C)] text-center font-bold xs:text-xl xs:leading-7 sm:text-[40px] sm:leading-[56px]">
                Good job! Let’s move to the next step
            </h5>


            <div className="xs:flex sm:block xs:bottom-[60px] xs:fixed sm:bottom-auto sm:mt-8 sm:relative font-semibold text-base">
                <Link href="/educations">
                    <Button size="lg" className=" sm:w-[300px] h-[56px]">
                        Continue
                    </Button>
                </Link>

                <p className="mt-[8px] xs:hidden sm:block">Enter ↵</p> 
            </div>

            <OnboardFooter></OnboardFooter>      
        </div>
    );
}