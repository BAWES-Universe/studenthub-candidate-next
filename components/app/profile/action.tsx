import { setLanguage } from "@/store/slices/appSlice";
import { logout } from "@/store/slices/authSlice";
import { Globe, KeyRound, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/app/18n";

export function CandidateAction() {
    const router = useRouter()
    const {  t } = useTranslation();
    const dispatch = useDispatch();

    const logoutClicked = () => {   
        dispatch(logout());
        router.push("/login");    
    }

    const changeLanguageClicked = () => {
        const language = i18n.language == "ar"? "en": "ar";
        console.log(i18n);
        i18n.changeLanguage(language, (e) => {
            console.log(e);
        });
        dispatch(setLanguage({
            language: language
        }));    
    }

    return (
        <div className="w-full h-40 py-2 bg-white rounded-2xl flex-col justify-start items-start inline-flex">
            
            <div onClick={() => router.push("/change-password")} className="cursor-pointer border-slate-200 border-b  self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <KeyRound />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">Change Password</div>
                </div>
            </div>

            <div onClick={changeLanguageClicked} className="cursor-pointer border-slate-200 border-b self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <Globe />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-semibold font-['Cairo'] leading-tight">عربي</div>
                </div>
            </div>

            <div onClick={logoutClicked} className="cursor-pointer  self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <LogOut />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">Logout</div>
                </div>
            </div>
        </div>
    );
}

