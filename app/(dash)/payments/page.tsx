"use client"
import Pager from '@/components/common/pager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// app/(dash)/payments/PaymentsPage.jsx

import { Salary } from '@/models/salary';
import { page, track } from '@/providers/analytics.service';
import { listSalary, profile, profileWithBank } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppSelector } from '@/store/store';
import { useAppDispatch } from '@/store/store';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PaymentsPage = () => {
    
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();


  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

    useEffect(() => {
        loadData();

        page('Payments Page');

        return () => {
            track('page_exit', { page: 'Payments Page' });
        }
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await listSalary(page);
        setSalaries(response.data);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setLoading(false);
    };
 

  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadData(page);
  }
 
    return (
        <div className="max-w-4xl mx-auto p-4">
            {loading && <div>Loading...</div>}
            {user && (
                <>
                    <h1 className="text-2xl font-bold">{!user.bank_id ? "Bank Information" : "Payments"}</h1>

                    {!user.bank_id && (
                        <h3 className='mt-1'>We'll need your bank information to pay you for work done</h3>
                    )}
                    {user.bank_id && salaries.length === 0 && (
                        <h3 className='mt-1'>We'll be making payments to the following bank account</h3>
                    )}

                    <Button className="btn mt-2 mb-4" onClick={() => router.push('/bank')}>
                        Enter Bank Information
                    </Button>

                    {salaries.length > 0 && (
                        <div className="salaries">
                            
                            {salaries.map((salary: any) => (
                                <Card 
                                    key={salary.tc_id} 
                                    onClick={() => router.push('/payments/' + salary.tc_id)}
                                    className={`cursor-pointer salary-card ${salary.status === 'Unpaid' ? 'border-l-4 border-yellow-400' : 'border-l-4 border-green-500'} shadow-md bg-white rounded-md my-4`}
                                >
                                    <CardContent className="p-6">  
                                        <span className="text-black text-sm">{format(new Date(salary.tc_created_at || ''), 'MMMM d, yyyy')}</span>
                                        <p className="text-black text-lg font-medium">
                                            {salary.hours > 0 && <span>{salary.hours} hours </span>}
                                            {salary.minutes > 0 && <span>{salary.minutes} minutes </span>}
                                            {salary.seconds > 0 && <span>{salary.seconds} seconds </span>}
                                            x {salary.candidate_hourly_rate.toFixed(3)} per hour
                                            {salary.candidate_bonus > 0 && <span>+ {salary.candidate_bonus.toFixed(3)} {salary.currency_code} bonus</span>}
                                        </p>
                                        <p className="text-black text-2xl font-semibold">{salary.candidate_total.toFixed(3)} {salary.currency_code}</p>
                                        <p className="font-bold text-black mb-4">Transfer pending from {salary.company_name}</p>
                                        {salary.status === 'Unpaid' && <p className="text-black text-xs">Transfer pending, please contact us if you don’t receive it</p>}
                                        {salary.status === 'Paid' && (
                                            <div>
                                                <span>Transferred to</span>
                                                <span>{salary.bank.bank_name}</span>
                                                <span>{salary.transfer_benef_name}</span>
                                                <span>{salary.transfer_benef_iban}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}


                            <Pager pagination={pagination} loadPage={loadPage} />

                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentsPage;