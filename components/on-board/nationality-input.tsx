
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon } from "lucide-react";
import React, { useId } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

interface NationalityInputProps {
    selectedCountry: any;
    onSelect: (country: any) => void;
}

export default function NationalityInput({ selectedCountry, onSelect }: NationalityInputProps) {

    const [open, setOpen] = React.useState(false)

    const countryList = [{
        country_id: 1,
        country_nationality_name_en: "Indian"
    },
    {
        country_id: 2,
        country_nationality_name_en: "Kuwaiti"
    }];

    const handleSelect = (country: any) => {
        onSelect(country);
        setOpen(false);
    };

    const id = useId()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>

                <FormItem className="relative cursor-pointer">
                    <FormControl>

                        <p
                            className={`peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                            border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                            placeholder-transparent border
                            
                            ${selectedCountry?.country_id ? 'pt-[32px]' : ''}
                            `}
                        >
                            {selectedCountry?.country_id ?
                                selectedCountry.country_nationality_name_en : null}
                        </p>

                    </FormControl>
                    <FormLabel
                        htmlFor={id}

                        className={
                            `absolute left-[5px] z-10 bg-white px-4 transition-all duration-200
                            top-1/2 -translate-y-1/2 scale-100
                            text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                            
                            ${selectedCountry?.country_nationality_name_en ?
                                                'top-3.5 left-[0px] -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4' : ''} 
                                
                            `}
                    >
                        Nationality
                    </FormLabel>
                    <FormMessage />
                </FormItem>

            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countryList.map((country: any) =>
                                    country ? (

                                        <CommandItem key={country.country_id} className="gap-2 cursor-pointer"
                                            onSelect={() => handleSelect(country)}>
                                            <span className="flex-1 text-sm">{country.country_nationality_name_en}</span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${country.country_id == selectedCountry?.country_id ?
                                                    "opacity-100" : "opacity-0"}`}
                                            />
                                        </CommandItem>

                                    ) : null,
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}