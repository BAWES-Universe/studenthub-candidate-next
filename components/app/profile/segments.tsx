import { useTranslation } from "react-i18next";

export function Segments({ onChange, segment = 'work-details'}: { onChange: (segment: string) => void, segment: string  }) {

    const { t } = useTranslation();

    return (<div className="w-full h-11 justify-start items-start gap-2 inline-flex cursor-pointer mt-2">

        <div className={ `px-2 py-2.5 bg-white justify-center items-center gap-2.5 flex ${segment == 'work-details'?'shadow-[0px_-2px_0px_0px_#263879_inset]':''} `} onClick={() => onChange('work-details')}>
            <div className={ `text-center ${segment == 'work-details'? 'text-[#263879]': 'text-[#68687a]'} text-base font-semibold leading-normal` }>
                { t('Work Details') }
            </div>
        </div>
        <div className={ `px-2 py-2.5 bg-white justify-center items-center gap-2.5 flex ${segment == 'personal-details'?'shadow-[0px_-2px_0px_0px_#263879_inset]':''}` } onClick={() => onChange('personal-details')}>
            <div className={ `text-center ${segment == 'personal-details'? 'text-[#263879]': 'text-[#68687a]'} text-base font-medium leading-normal` }>
                { t('Personal Details') }
            </div>
        </div>
        {/*}
        <div className={ `px-2 py-2.5 bg-white justify-center items-center gap-2.5 flex" onClick={() => onChange('financials')}>
            <div className="text-center ${segment == 'work-details'? 'text-[#263879]': 'text-[#68687a]'} text-base font-medium leading-normal">
            { t('Financials') }</div>
        </div>*/}
    </div>);
}