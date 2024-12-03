"use client"
// app/(dash)/payments/PaymentsPage.jsx

import { Salary } from '@/models/salary';
import { page, track } from '@/providers/analytics.service';
import { listSalary, profile, profileWithBank } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppSelector } from '@/store/store';
import { useAppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';

const PaymentsPage = () => {
    
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

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

    const loadData = async (refresh = false) => {
        setLoading(true);
        const response = await listSalary(currentPage);
        setSalaries(response.data);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
        setLoading(false);
    };
 

    const updateBank = async () => {
        // Logic to open modal and update bank information
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {loading && <div>Loading...</div>}
            {user && (
                <>
                    <h1 className="text-2xl font-bold">{!user.bank_id ? "Bank Information" : "Payments"}</h1>
                    {!user.bank_id && (
                        <h3>We'll need your bank information to pay you for work done</h3>
                    )}
                    {user.bank_id && salaries.length === 0 && (
                        <h3>We'll be making payments to the following bank account</h3>
                    )}
                    <button onClick={updateBank} className="btn">
                        Enter Bank Information
                    </button>
                    {salaries.length > 0 && (
                        <div className="salaries">
                            {salaries.map((salary: any) => (
                                <div key={salary.tc_id} className={`salary-card ${salary.status === 'Unpaid' ? 'pending' : 'success'}`}>
                                    <span className="date">{salary.tc_created_at}</span>
                                    <p className="totals">
                                        {salary.hours > 0 && <span>{salary.hours} hours </span>}
                                        {salary.minutes > 0 && <span>{salary.minutes} minutes </span>}
                                        {salary.seconds > 0 && <span>{salary.seconds} seconds </span>}
                                        x {salary.candidate_hourly_rate.toFixed(2)} per hour
                                        {salary.candidate_bonus > 0 && <span>+ {salary.candidate_bonus.toFixed(2)} {salary.currency_code} bonus</span>}
                                    </p>
                                    <p className="sal">{salary.candidate_total.toFixed(2)} {salary.currency_code}</p>
                                    <p className="from">Transfer pending from {salary.company_name}</p>
                                    {salary.status === 'Unpaid' && <p className="pending-status">Transfer pending, please contact us if you don’t receive it</p>}
                                    {salary.status === 'Paid' && (
                                        <div>
                                            <span>Transferred to</span>
                                            <span>{salary.bank.bank_name}</span>
                                            <span>{salary.transfer_benef_name}</span>
                                            <span>{salary.transfer_benef_iban}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentsPage;