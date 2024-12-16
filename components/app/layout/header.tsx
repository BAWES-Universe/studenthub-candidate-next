import { useRouter } from "next/navigation";
import Navigation from "./navigation";
import { useEffect } from "react";
import { useState } from "react";
import { StoreState, useAppSelector } from "@/store/store";
 
import { Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);
    
    const { totalUnreadActity } = useAppSelector((state: StoreState) => state.app);

    useEffect(() => {
       // console.log("state", window.history, window.history.state.idx, window.history.state.length)
        if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
            setCanGoBack(true);
            //setCanGoForward(true);
            //window.history.state && 
            //window.history.state.idx < window.history.state.length - 1
        }
    }, []);
    
    return (
        <>
            <div className="max-w-4xl mx-auto relative">
                <div className="py-7 xs:hidden sm:block">
                    <img src="/assets/icons/logo.svg" className="w-[167px] mx-auto " />
                </div>

                <Button onClick={() => router.push('/activity')} variant="ghost" 
                    className="xs:hidden sm:block absolute top-6 end-4">  
                    <Bell className="size-10" />
                    {totalUnreadActity > 0 && <Badge variant={"destructive"} className="absolute end-[-5px] top-[-5px] rounded-full"  
                        color="warning">{totalUnreadActity}</Badge>}
                </Button>
            </div>

            <Navigation></Navigation>

            <div className="max-w-4xl mx-auto relative">
            { canGoBack && 
                <div className="xs:block sm:hidden px-6 py-4  bg-white">
                    <button onClick={() => router.back()} className="flex w-10 h-10 flex-col items-start gap-2.5 [background:var(--Neutral-20,#F5F5F7)] p-2 rounded-[20px]">
                        <ChevronLeft className="stroke-[#7d7d8d]" />
                    </button>
                </div> }
    
            <Button onClick={() => router.push('/activity')} variant="ghost" 
                className="sm:hidden absolute top-6 end-4">  
                <Bell className="size-10" />
                {totalUnreadActity > 0 && <Badge variant={"destructive"} className="absolute end-[-5px] top-[-5px] rounded-full"  
                    color="warning">{totalUnreadActity}</Badge>}
            </Button>    
            </div>
        </>
    );
}