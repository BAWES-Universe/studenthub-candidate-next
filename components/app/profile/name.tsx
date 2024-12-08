import { Candidate } from "@/models/candidate";
import { useAppSelector } from "@/store/store";

export function Name() {

    const { user } = useAppSelector(state => state.user) as { user: Candidate };

    return (
        <div className="h-20 justify-start items-center gap-4 inline-flex mt-4">
            { user.candidate_personal_photo && <img className="w-20 h-20 relative rounded-[44px]" src={process.env.NEXT_PUBLIC_CLOUDINARY_URL + 'candidate-photo/' + 
                user.candidate_personal_photo} /> }
            { !user.candidate_personal_photo && <img src="/assets/images/avatar.jpg" /> }

            <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="justify-start items-center gap-6 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-2xl font-bold leading-loose">
                        {user.candidate_name}
                    </div>
                </div>
                <div className="justify-start items-center gap-6 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-base font-bold leading-normal">
                        {user.candidate_name_ar}
                    </div>
                </div>
            </div>
        </div>
    )
}