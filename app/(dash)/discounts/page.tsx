// app/(dash)/discounts/DiscountsPage.jsx

import React, { useEffect, useState } from 'react';
import { DiscountCategory } from '@/models/discount-category';
import { Discount } from '@/models/discount';
import { listDiscountCategories } from '@/providers/logged-in/discount-category.service';
import { listDiscounts } from '@/providers/logged-in/discount.service';
import { page, track } from '@/providers/analytics.service';

const DiscountsPage = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discountCategories, setDiscountCategories] = useState<DiscountCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [filters, setFilters] = useState<{ category_id: number | null | undefined }>({ category_id: null });

    useEffect(() => {
        loadCategories();
        loadData(1);
 
        page('Discounts Page');

        return () => {
            track('page_exit', { page: 'Discounts Page' });
        }
   
    }, []);

    const loadCategories = async () => {
        const response = await listDiscountCategories(-1);
        setDiscountCategories(response.body);
    };

    const loadData = async (page: number, silent = false) => {
        if (!silent) {
            setLoading(true);
        }

        const response = await listDiscounts(page, getUrlParams());
        setLoading(false);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
        setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
        setDiscounts(response.data);
    };

    const doInfinite = async () => {
        const nextPage = currentPage + 1;
        setLoading(true);
        const response = await listDiscounts(nextPage, getUrlParams());
        setLoading(false);
        setPageCount(parseInt(response.headers.get('X-Pagination-Page-Count')));
        setCurrentPage(parseInt(response.headers.get('X-Pagination-Current-Page')));
        setDiscounts([...discounts, ...response.data]);
    };

    const getUrlParams = () => {
        let url = "";
        if (filters.category_id) {
            url += `&category_id=${filters.category_id}`;
        }
        return url;
    };

    const resetCategorySelected = () => {
        setFilters({ category_id: null });
        setDiscounts([]);
        loadData(1);
    };

    const onCategorySelected = (category: DiscountCategory) => {
        setFilters({ category_id: category.category_id });
        setDiscounts([]);
        loadData(1);
    };

    const onSelected = async (discount: Discount) => {
        //todo: open modal
        /*const modal = await openModal(DiscountDetailPage, { model: discount });
        modal.onDidDismiss().then((e) => {
            if (!e.data || e.data.from !== 'native-back-btn') {
                window.history.back();
            }
        });*/
    };

    const openModal = async (Component: any, props: any) => {
        // Implement modal opening logic here
    };

    const errorLogo = (event: any, discount: Discount) => {
        if (discount.company) {
            discount.company.company_logo = null;
        }
    };

    const errorImage = (event: any, discount: Discount) => {
        if (discount.image) {
            discount.image = undefined;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold">{/* Translate "Discounts" */} Discounts</h1>
            <div className="category-wrapper">
                <button onClick={resetCategorySelected} className={`category ${!filters.category_id ? 'selected' : ''}`}>
                    All
                </button>
                {discountCategories.map((category: DiscountCategory) => (
                    <button key={category.category_id} onClick={() => onCategorySelected(category)} className={`category ${filters.category_id === category.category_id ? 'selected' : ''}`}>
                        {category.name_en} {/* Translate based on language */}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {discounts.map((discount) => (
                    <div key={discount.discount_uuid} className="card-discount" onClick={() => onSelected(discount)}>
                        {discount.image ? (
                            <img src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}discount/${discount.image}`} onError={(e) => errorImage(e, discount)} alt={discount.description_en} />
                        ) : (
                            <img src="/assets/icon.png" alt="Default" />
                        )}
                        <h2>{discount.company?.company_common_name_en}</h2> {/* Translate based on language */}
                        <h3>{discount.description_en}</h3> {/* Translate based on language */}
                        <p>{discount.how_to_apply_en}</p> {/* Translate based on language */}
                    </div>
                ))}
            </div>

            {!loading && discounts.length === 0 && (
                <div className="no-items">
                    <img src="assets/icons/no-invitation.svg" alt="No items" />
                    <p>Coming soon...</p>
                </div>
            )}

            {currentPage < pageCount && (
                <button onClick={doInfinite} className="load-more">
                    Load More
                </button>
            )}
        </div>
    );
};

export default DiscountsPage;