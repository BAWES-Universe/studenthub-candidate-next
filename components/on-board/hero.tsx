import Image from "next/image";
import { Button } from "@/components/ui/button";
 
//import Rocket from '../../public/'; // Adjust the path as necessary

export function Hero() {
  return (

    <div className="flex  min-h-screen flex-col items-center  text-center px-4 p-[16px]">

      <div className="w-[240px] h-[240px] bg-[#f9f9f9] rounded-[118px] flex justify-center items-center mb-[40px] xs:mt-[87px] sm:mt-[40px]">
        <img src="/assets/icons/rocket.svg" className="w-[128px] h-[128px]" />
      </div>
      
      <h1 className="font-bold tracking-tighter xs:text-[20px] sm:text-[40px]">
        Ready for a whole new adventure? <br />
        Let&apos;s get you working!
      </h1>
      
      <div className="xs:flex sm:block xs:bottom-[76px] xs:fixed sm:bottom-auto sm:mt-8 sm:relative font-semibold text-base">
        <Button size="lg" className=" sm:w-[300px] h-[56px]">
          Let&apos;s do it!
        </Button>
        <p className="mt-[8px] xs:hidden sm:block">Enter ↵</p> 
      </div>

      <div className="xs:fixed xs:bottom-[16px] sm:mt-12 sm:relative  space-y-2 text-sm text-muted-foreground">
        <p>
          Have an account?{" "}
          <a href="/login" className="no-underline text-primary">
            Login
          </a>
        </p>
        <p>
          Need help?{" "}
          <a href="/contact" className="no-underline text-primary">
            Contact Us
          </a>
        </p>
      </div>
    </div>
  );
}