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

    const id = params?.id as any;

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
        <div className="max-w-4xl mx-auto p-4">
            
            {loading && <div>Loading...</div>}

            {salary &&
            <div>
                <div className="text-[#22223d] text-lg font-semibold leading-7 mb-4">Transfer Details</div>
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            Employer
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                            {salary.company_name}
                        </span>
                    </div>
                </div>

                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Bank
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                        {salary.bank && salary.bank.bank_name}  
                        </span>
                    </div>
                </div>
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Bank IBAN
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                        {salary.transfer_benef_iban}  
                        </span>
                    </div>
                </div>
                
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Transferred to
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                                {salary.transfer_benef_name} 
                        </span>
                    </div>
                </div>
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Date
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                        {format(salary.tc_created_at || '', 'MMMM d, yyyy')}
                        </span>
                    </div>
                </div>
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Amount
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                        {salary.currency_code} {salary.candidate_total?.toFixed(3)} 
                        </span>
                    </div>
                </div>
                <div className="flex-row">
                    <div className='p-4 flex-row border-b'>
                        <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                        Status
                        </span>
                        <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-right float-end text-sm font-normal leading-5'>
                        { salary.status == 'Unpaid'? "Pending": "Successful"}
                        </span>
                    </div>
                </div>
    
            </div>    
            }
        </div> 
    );
};

export default PaymentDetailPage;