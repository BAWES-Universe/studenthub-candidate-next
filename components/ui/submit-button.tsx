import { Button } from "./button";


interface SubmitButtonProps {
    disabled?: boolean;
    float?: boolean;
}
 

export default function SubmitButton({ disabled, float = true }: SubmitButtonProps) {
    return (
        <>
        <div className={ `${float ? 'xs:float-auto sm:float-end':'text-center'} mt-8 
            font-semibold text-base items-center` }>
{/*
            <Button variant={"ghost"} className="text-[#4B4B61] text-center  text-base font-normal leading-6">
            Do it later
            </Button>    */}

            <Button size="lg" className="shadow-none xs:w-full sm:w-[156px] h-[56px] text-base font-semibold leading-6
                disabled:bg-[#EEEEF0] disabled:text-[color:#68687A]" disabled={ disabled }>
                Next
            </Button>
            <p className={ `mt-[8px] xs:hidden ${disabled?'hideen':'sm:block'}  text-center` }>Enter ↵</p> 

        </div>
        
        <div className="clearfix"></div>
        </>
    );
}