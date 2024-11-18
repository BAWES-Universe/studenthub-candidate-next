import { Button } from "./button";


interface SubmitButtonProps {
    disabled?: boolean
}
 

export default function SubmitButton({ disabled }: SubmitButtonProps) {
    return (
        <>
        <div className="xs:float-auto sm:float-end mt-8 font-semibold text-base items-center">
            <Button size="lg" className="shadow-none xs:w-full sm:w-[156px] h-[56px] text-base font-semibold leading-6
                disabled:bg-[#EEEEF0] disabled:text-[color:#68687A]" disabled={ disabled }>
                Next
            </Button>
            <p className="mt-[8px] xs:hidden sm:block text-center">Enter ↵</p> 
        </div>
        
        <div className="clearfix"></div>
        </>
    );
}