import { Progress } from "../ui/progress";

export function OnboardProgress({ arrProgress }: { arrProgress: number[] }) {    
    return (
        <div className="flex mt-[8px]">
            <div className="flex-item w-1/3 mx-[24px] justify-center">
                <Progress value={arrProgress[0]} className="w-full" />
                <p className="mt-[12px] xs:justify-self-auto sm:justify-center text-center">
                    Personal Information
                </p>
            </div>
            <div className="flex-item w-1/3 mx-[24px]">
                <Progress value={arrProgress[1]} className="w-full" />
                <p className="mt-[12px] xs:justify-self-auto sm:justify-center text-center">
                    Education & Experience  
                </p>
            </div>
            <div className="flex-item w-1/3 mx-[24px]">
                <Progress value={arrProgress[2]} className="w-full" />
                <p className="mt-[12px] xs:justify-self-auto sm:justify-center text-center">
                    About you
                </p>
            </div>
        </div>
    )
}