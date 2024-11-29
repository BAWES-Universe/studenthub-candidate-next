import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
import { CheckIcon } from "lucide-react";
import React, { useEffect, useId, useState } from "react";
import { FormInput } from "../ui/form-input";
import { Card, CardContent } from "../ui/card";
import { listMajors } from "@/providers/logged-in/candidate-education.service";

interface NationalityInputProps {
    selectedMajor: any | null;
    onSelect: (major: any) => void;
    name: string;
    form: any;
}

export default function PagedMajorInput({ selectedMajor, onSelect, name, form }: NationalityInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [majorList, setMajorList] = useState([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    useEffect(() => {
         
        if (!open || form.getValues(name) == "") {
            return;
        }

        loadPage(1)

    }, [form.watch(name)])
 
    const handleSelect = (major: any) => {
        setOpen(false)
        onSelect(major); 
        setMajorList([]);        
    };
 
    const onFocus = () => {
        setOpen(true)
       // onSelect(null); 
    }

    const loadPage = (page: number) => {
          
        if (page > pagination.total_pages || page < 1) {
            return;
        }

        setLoading(true);   
 
        listMajors(page, "&q=" + form.getValues(name)).then((res) => {
            setMajorList(res.data);

            setPagination({
                current_page: parseInt(res.headers.get('X-Pagination-Current-Page') || '1'),
                total_pages: parseInt(res.headers.get('X-Pagination-Page-Count') || '1'),
            });

        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="relative">
             
                <FormInput
                    onFocus={() => onFocus()}
                    name={name}
                    label="Field of Study"
                    form={form as any}    
                    autoComplete="off"
                    ></FormInput>
                 
                 { /** absolute */}
                    
                { majorList.length > 0 ? (
                    
                    <Card className="absolute bg-white top-full left-0 w-full mt-2
                    border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                    border-gray-300 overflow-hidden z-[999999999]
                        ">
                        <CardContent className="pt-2 bg-white z-100">
                    <ul className="bg-white">
                        {majorList.map((major: any) =>
                    major ? (

                        <li key={major.major_uuid} className="gap-2 cursor-pointer"
                            onClick={() => handleSelect(major)}>
                            <span className="flex-1 text-sm">{major.major_name_en}</span>
                            <CheckIcon
                                className={`ml-auto size-4 ${major.major_uuid == selectedMajor?.major_uuid ?
                                    "opacity-100" : "opacity-0"}`}
                            />
                        </li>

                    ) : null,
                    )} 
                </ul>

                { pagination.total_pages > 1 && (
                    <Pagination>
                        <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page - 1)} />
                        </PaginationItem>

                        {Array.from({ length: Math.min(pagination.total_pages, 2) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink 
                                    className="cursor-pointer"
                                    onClick={() => loadPage(page)}
                                    isActive={page === pagination.current_page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                         
                         {
                            pagination.total_pages > 2 && (
                                <PaginationEllipsis />
                            )
                         }

                        <PaginationItem>
                            <PaginationNext 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page + 1)} />
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )  
                }
                </CardContent>
                </Card>
                ) : null
                }

        </div> 
    )
}