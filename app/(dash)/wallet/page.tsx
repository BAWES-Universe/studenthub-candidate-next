"use client"
import Pager from '@/components/common/pager';
// app/(dash)/wallet/WalletBalanceListPage.tsx

import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { payableList } from '@/providers/logged-in/balance.service';
import { format } from 'date-fns';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const WalletBalanceListPage = () => {

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState<any[]>([]);
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const { t } = useTranslation();
    
    useEffect(() => {
        page('Wallet Balance List');
        loadData();
        const subscription = requestUpdated$.subscribe(() => {
            loadData();
        });
        return () => {
            subscription.unsubscribe();
            track('page_exit', { page: 'Wallet Balance List' });
        };
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await payableList(page);
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setBalances(response.data);
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

    const positive = (value: number) => Math.abs(value);

    return (
        <div className="max-w-4xl mx-auto p-4"> 
            { /*<header className="flex items-center justify-between">
                <button onClick={() => history.goBack()} className="btn-close">
                    <img src="assets/images/icon-back.svg" alt="Back" />
                </button>
                <h1 className="text-xl font-bold">{t("Wallet")}</h1>
            </header>*/}

            {loading && <div className="progress-bar">Loading...</div>}
            <h2 className="font-semibold text-lg mt-6">{t("Wallet Balance")}</h2>

            {balances.length > 0 ? (
                balances.map((balance) => (
                    <div key={balance.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <p>
                            <strong>{balance.amount < 0 ? t("Debit:") : t("Credit:")}</strong> 
                            {positive(balance.amount).toLocaleString('en-US', { style: 'currency', currency: 'KWD' })}
                        </p>
                        <p><strong>{t("Balance:")}</strong> {balance.balance.toLocaleString('en-US', { style: 'currency', currency: 'KWD' })}</p>
                        <p><strong>{t("Note:")}</strong> {balance.data}</p>
                        <p><strong>{t("Created At:")}</strong> 
                            {format(balance.created_at || '', 'MMMM d, yyyy')}</p>
                        <p><strong>{t("Transaction time:")}</strong> 
                            {format(balance.transaction_datetime || '', 'MMMM d, yyyy')}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-center">{t("No record found")}</p>
            )}

            <Pager pagination={pagination} loadPage={loadPage} />

        </div>
    );
};

export default WalletBalanceListPage;