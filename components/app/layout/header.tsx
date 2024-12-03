import Navigation from "./navigation";

export default function Header() {
    return (
        <>
            <div className="py-7">
                <img src="/assets/icons/logo.svg" className="w-[167px] mx-auto " />
            </div>
            <Navigation></Navigation>
        </>
    );
}