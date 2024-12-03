"use client"
// app/(dash)/wallet/WalletBalanceListPage.tsx

import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { payableList } from '@/providers/logged-in/balance.service';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const WalletBalanceListPage = () => {

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

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

    const loadData = async () => {
        setLoading(true);
        const response = await payableList(currentPage);
        setLoading(false);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
        setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
        setBalances(response.body);
    };

    const doInfinite = async () => {
        if (currentPage < pageCount) {
            setLoading(true);
            const response = await payableList(currentPage + 1);
            setBalances(prevBalances => [...prevBalances, ...response.body]);
            setCurrentPage(prevPage => prevPage + 1);
            setLoading(false);
        }
    };

    const positive = (value: number) => Math.abs(value);

    return (
        <div className="max-w-screen-lg mx-auto p-6">
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
                        <p><strong>{t("Created At:")}</strong> {new Date(balance.created_at).toLocaleDateString()}</p>
                        <p><strong>{t("Transaction time:")}</strong> {new Date(balance.transaction_datetime).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-center">{t("No record found")}</p>
            )}

            {currentPage < pageCount && (
                <button onClick={doInfinite} className="mt-4 text-blue-500">
                    {loading ? t("Loading more...") : t("Load More")}
                </button>
            )}
        </div>
    );
};

export default WalletBalanceListPage;