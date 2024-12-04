"use client"
// app/(dash)/payments/PaymentsPage.jsx

import { Salary } from '@/models/salary';
import { page, track } from '@/providers/analytics.service';
import { viewSalary } from '@/providers/logged-in/account.service';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PaymentDetailPage = () => {
    
    const [salary, setSalary] = useState<Salary>();
    const [loading, setLoading] = useState(false);
  
    const params = useParams();

    const id = params.id as any;

    useEffect(() => {
        loadData();

        page('Payment Detail Page');

        return () => {
            track('page_exit', { page: 'Payment Detail Page' });
        }
    }, []);

    const loadData = async (refresh = false) => {
        setLoading(true);
        const response = await viewSalary(id);
        setSalary(response);
        setLoading(false);
    };
 
    return (
        <div className="max-w-2xl mx-auto p-4">
            

            {loading && <div>Loading...</div>}

            {salary &&
            <div className="h-[451px] flex-col justify-start items-start gap-2 inline-flex">
            <div className="self-stretch px-4 justify-start items-start gap-2 inline-flex">
                <div className="text-[#22223d] text-lg font-semibold leading-7">Transfer Details</div>
            </div>
            <div className="flex-col justify-start items-start flex">

                <div className="flex-col justify-start items-center flex">
                    <div className="w-[390px] h-14 relative">
                        <div className="w-[390px] h-14 left-0 top-0 absolute opacity-0 bg-[#f7f8fa]" />
                        <div className="h-6 left-[16px] top-[16px] absolute justify-start items-center gap-6 inline-flex">
                            <div className="w-[63px] h-6 text-[#4b4b61] text-sm font-normal leading-tight">Employer</div>
                            <div className="w-[271px] text-right text-[#0f0f2c] text-sm font-normal leading-tight">
                                {salary.company_name}
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-px bg-[#eeeef0]" />
                </div>
                <div className="flex-col justify-start items-center flex">
                    <div className="w-[390px] h-14 relative">
                        <div className="w-[390px] h-14 left-0 top-0 absolute opacity-0 bg-[#f7f8fa]" />
                        <div className="h-6 left-[16px] top-[16px] absolute justify-start items-center gap-6 inline-flex">
                            <div className="w-[63px] h-6 text-[#4b4b61] text-sm font-normal leading-tight">Transferred to</div>
                            <div className="w-[271px] text-right text-[#0f0f2c] text-sm font-normal leading-tight">
                            {salary.bank.bank_name} <br />
                            {salary.transfer_benef_name}  <br />
                            {salary.transfer_benef_iban}
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-px bg-[#eeeef0]" />
                </div>
                <div className="flex-col justify-start items-center flex">
                    <div className="w-[390px] h-14 relative">
                        <div className="w-[390px] h-14 left-0 top-0 absolute opacity-0 bg-[#f7f8fa]" />
                        <div className="h-6 left-[16px] top-[16px] absolute justify-start items-center gap-6 inline-flex">
                            <div className="w-[63px] h-6 text-[#4b4b61] text-sm font-normal leading-tight">Date</div>
                            <div className="w-[271px] text-right text-[#0f0f2c] text-sm font-normal leading-tight">
                                {format(new Date(salary.tc_created_at || ''), 'MMMM d, yyyy')}
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-px bg-[#eeeef0]" />
                </div> 
                <div className="flex-col justify-start items-center flex">
                    <div className="w-[390px] h-14 relative">
                        <div className="w-[390px] h-14 left-0 top-0 absolute opacity-0 bg-[#f7f8fa]" />
                        <div className="h-6 left-[16px] top-[16px] absolute justify-start items-center gap-6 inline-flex">
                            <div className="w-[63px] h-6 text-[#4b4b61] text-sm font-normal leading-tight">Amount</div>
                            <div className="w-[271px] text-right text-[#0f0f2c] text-sm font-normal leading-tight">
                                {salary.currency_code} {salary.candidate_total?.toFixed(3)} 
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-px bg-[#eeeef0]" />
                </div>
                <div className="flex-col justify-start items-center flex">
                    <div className="w-[390px] h-14 relative">
                        <div className="w-[390px] h-14 left-0 top-0 absolute opacity-0 bg-[#f7f8fa]" />
                        <div className="h-6 left-[16px] top-[16px] absolute justify-start items-center gap-6 inline-flex">
                            <div className="w-[63px] h-6 text-[#4b4b61] text-sm font-normal leading-tight">Status</div>
                            <div className="w-[271px] text-right text-[#0f0f2c] text-sm font-normal leading-tight">
                                { salary.status == 'Unpaid'? "Pending": "Successful"}
                            </div>
                        </div>
                    </div>
                    <div className="w-[390px] h-px bg-[#eeeef0]" />
                </div> 
            </div>
            </div>    
            }
        </div> 
    );
};

export default PaymentDetailPage;