import OnboardNav from "../navigation";
import NeedHelp from "../need-help";

export default function OnboardFooter() {
    return (

        <div className="text-center fixed bottom-[16px] left-1/2 -translate-x-[86px] items-center justify-center block">

            <OnboardNav></OnboardNav>

            <NeedHelp></NeedHelp>
        </div>
    );
}