// app/(dash)/company/page.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { Company } from '@/models/company'; // Adjust the import path as necessary
import { langContent } from '@/utils/common';
import { Brand } from '@/models/brand';
import { page, track } from '@/providers/analytics.service';

const CompanyPage = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const { t } = useTranslation(); // Translation hook
  const slideOpts = {
    // Default parameters
    slidesPerView: 10,
    spaceBetween: 10,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 20 },
      480: { slidesPerView: 3, spaceBetween: 30 },
      640: { slidesPerView: 4, spaceBetween: 40 },
      950: { slidesPerView: 6, spaceBetween: 40 },
    },
  };

  useEffect(() => {
    // Analytics tracking
    page('Company page');

    return () => {
      track('page_exit', { page: 'Company page' });
    };
  }, []);

  const dismiss = () => {
    // Logic to dismiss modal
  };

  const setNull = () => {
    if (company) {
      setCompany({ ...company, company_logo: null });
    }
  };

  return (
    <div className="max-w-screen-lg p-6">
      {company && (
        <>
          <button onClick={dismiss} className="btn-close">
            <img src="assets/images/ic_cancel.svg" alt="Close" />
          </button>

          {company.company_logo && (
            <div className="flex items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}${company.company_logo}`}
                onError={setNull}
                alt="Company Logo"
                className="rounded-full"
              />
            </div>
          )}

          <h3 className="font-bold text-2xl my-12">
            {t(company.company_common_name_en || company.company_name || '')}
          </h3>

          {company.company_website && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="website"
              href={company.company_website}
            >
              {company.company_website}
            </a>
          )}

          {company.company_description_en && (
            <p className="desc" dangerouslySetInnerHTML={{ __html: langContent(company.company_description_en, company.company_description_ar || '' ) }} />
          )}

          {company.brands && (
            <div className="flex space-x-4 overflow-x-auto">
              {company.brands.map((brand: Brand) => (
                <div key={brand.brand_uuid} className="flex flex-col items-center">
                  {!brand.brand_logo ? (
                    <span>{langContent(brand.brand_name_en || '', brand.brand_name_ar || '')}</span>
                  ) : (
                    <img
                      src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}company-brand/${brand.brand_logo}`}
                      alt={brand.brand_name_en}
                      className="w-36 h-36 rounded-full"
                    />
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

export default CompanyPage;