// app/(dash)/update-bank/page.tsx

import { profile, updateBankDetail } from '@/providers/logged-in/account.service';
import { useAppSelector } from '@/store/store';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/store';
import { errorMessage } from '@/utils/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/dist/client/components/navigation';
import { useEffect, useState, useRef } from 'react';
import { Form, useForm } from 'react-hook-form'; // Assuming you're using react-hook-form for form handling
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { z } from 'zod';
import { FormInput } from '@/components/ui/form-input';
import SubmitButton from '@/components/ui/submit-button';
import { page, track } from '@/providers/analytics.service';


const formSchema = z.object({
  benef_name: z.string({
    required_error: 'Please add beneficiary name.'
  }),
  iban: z.string({
    required_error: 'Please add IBAN.'
    }),
})

const UpdateBankPage = () => {
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
   
  const benefNameRef = useRef(null);

  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      benef_name: user?.bank_account_name || "",
      iban: user?.candidate_iban || "",
    },
  })

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('benef_name', res.bank_account_name || "");
        form.setValue('iban', res.candidate_iban || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  
  useEffect(() => {
    // Analytics tracking
    console.log('Update Bank Page');
    // Set focus on the beneficiary name input after component mounts
    /*setTimeout(() => {
      if (benefNameRef.current) {
        benefNameRef.current.focus();
      }
    }, 300);*/


    page('Update Bank Page');

    return () => {
        track('page_exit', { page: 'Update Bank Page' });
    }
  }, []);

  const dismiss = (data = {}) => {
    // Logic to dismiss modal
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    /*if (!data.benef_name.trim()) {
      await Alert.alert(t('Please specify your full name'));
      return;
    }*/

    setLoading(true);

    const param = {
      benef_name: values.benef_name.trim().replace('.', ''),
      iban: values.iban,
    };

    try {
      const res = await updateBankDetail(param);
      setLoading(false);

      if (res.operation === 'success') {
        const eventData = {
          bank_account_name: values.benef_name,
          candidate_iban: values.iban,
          bank: res.bank,
        };
        //bankUpdated$.next(eventData);
        dismiss(eventData);
      } else {
        handleError(res);
      }
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  const handleError = async (res: any) => {
    //await Alert.alert(t(res.message));
    alert(errorMessage(res.message));
  };

  return (
    <div className="max-w-screen-lg p-6">
      <button onClick={dismiss} className="btn-close">
        <img src="assets/images/ic_cancel.svg" alt="Close" />
      </button>

      <h3>{t("Where would you like your money transferred?")}</h3>

      <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
            <FormInput
              name="benef_name"
              label="Beneficiary Name"
              form={form as any}
              type="text"
            />

            <FormInput
              name="iban"
              label="Bank IBAN"
              form={form as any}
              type="text"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>
           
    </div>
  );
};

export default UpdateBankPage;