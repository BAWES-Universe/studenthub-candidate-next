"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { deleteResume, deleteVideo, profile, updatePhoneDetail, updateResume, updateVideo } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { uploadFileToTempS3 } from "@/providers/logged-in/aws.service";

const formSchema = z.object({
    video: z.string({
      //  required_error: 'Please record or upload video.'
    }).nullable(),
    resume: z.string({
      //  required_error: 'Please upload front side of your national id.'
    }).nullable(),
})

export default function Video() {

  const [loading, setLoading] = useState(false);
  const [removingVideo, setRemovingVideo] = useState(false);
  const [removingResume, setRemovingResume] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video: user?.candidate_video,
      resume: user?.candidate_resume, 
    },
  })

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('video', res.candidate_video || "");
        form.setValue('resume', res.candidate_resume || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    router.push('/civil-id');
  } 

  function onVideoError(){
    form.setValue('video', "");
  }

  function removeVideo(){
    setRemovingVideo(true);

    deleteVideo().then(() => {
      form.setValue('video', "");

      dispatch(setUser({ user: {
        ...user,
        candidate_video: null
      } }));
    }).finally(() => {
      setRemovingVideo(false);
    });
  }

  function removeResume(){
    setRemovingResume(true);

    deleteResume().then(() => {
      form.setValue('resume', "");

      dispatch(setUser({ user: {
        ...user,
        candidate_resume: null
      } }));

    }).finally(() => {
      setRemovingResume(false);
    });
  }

  return (
    <div>
        <OnboardProgress />

        <h5 className="text-[color:var(--Neutral-100,#0F0F2C)] text-center 
         text-[40px] font-bold leading-[56px] mt-[102px] mb-[38px]">
            You’re almost there
        </h5>
  { /**block-inline max-w-[313px] xs:max-w-full xs:w-full  */}

       <div suppressHydrationWarning={true} className="flex flex-col sm:flex-row max-w-[640px]  min-h-[196px] m-auto mb-[24px]">
            { !form.getValues().video && <div className="xs:max-w-full sm:max-w-[313px]  flex-none text-center py-[24px] px-[46px] shrink-0 border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-2xl border-[1.333px] border-dashed mb-[24px] sm:mb-0 sm:me-[24px]">

                <img src="/assets/icons/video.svg" className="m-auto"></img>   

                <h6 className="self-stretch text-[color:var(--Neutral-95,#23233D)] text-center 
                    text-base font-semibold leading-6 mt-[8px] mb-[4px] block">
                    Introductory Video
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="inline relative top-[7px] m-0 p-[5px]" variant={'ghost'}>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[100%] p-[24px] max-w-[429px] text-[color:var(--Neutral-95,#23233D)] text-center text-base font-normal leading-6">
                        <p className="mb-[24px]">
                        Introductory video enhances your chance of being selected among other candidates.</p>
                      </PopoverContent>

                    </Popover>    
                </h6> 

                <p className="self-stretch text-[#4B4B61] text-center text-sm font-normal leading-5 mt-[4x] block">
                Record a 30-second video introducing yourself
                </p>

              <div className="mt-[16px] block">
                { /** TODO: ability to record video */ 
                uploadingVideo? <p className="text-[color:var(--Neutral-70,#7D7D8D)] text-sm font-normal leading-5 text-center">Uploading...</p> :
                <>

                  <a className="text-[color:var(--Blue-Tint-Main,#4C70F2)]  text-xs font-medium leading-4 ">
                    Record yourself
                  </a>

                  <span className="text-xs font-medium">&nbsp;or&nbsp;</span> 

                  <a onClick={() => document.getElementById('videoUpload')?.click()}  className="cursor-pointer text-[color:var(--Blue-Tint-Main,#4C70F2)]  text-xs font-medium leading-4">
                    Upload video
                  </a>
                </>
}
               </div>

            </div> }

            { form.getValues().video && <div className="xs:max-w-full w-full sm:max-w-[313px]  flex-none 
                  rounded-2xl mb-[24px] sm:mb-0 sm:me-[24px]">

                <img src={ process.env.NEXT_PUBLIC_PERMANENT_BUCKET_URL + 'candidate-video/' +  form.getValues().video + '.jpg' } 
                  onError={() => onVideoError()}
                  className="w-full"></img>   

                <Button variant={ "ghost"} onClick={() => removeVideo()} 
                  className="text-[color:var(--Neutral-70,#7D7D8D)] text-sm font-medium leading-5 text-center m-auto mt-[12px]">
                    <img src="/assets/icons/trash.svg" className="w-[16px]"></img>    
                    { removingVideo ? "Removing..." : "Remove" } 
                </Button>
            </div> }
            
            { !form.getValues().resume && <div className="xs:max-w-full sm:max-w-[313px] flex-none text-center py-[24px] px-[46px] shrink-0 border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-2xl border-[1.333px] border-dashed">

                <img src="/assets/icons/cv.svg" className="m-auto" />

                <h6 className="self-stretch text-[color:var(--Neutral-95,#23233D)] text-center 
                    text-base font-semibold leading-6  mt-[8px] mb-[4px] block">
                    CV or Portfolio
                </h6> 

                <p className="self-stretch text-[#4B4B61] text-center text-sm font-normal leading-5 mt-[4x] block">
                  Have a cool file to showcase your skills and experiences?
                </p>

                <a onClick={() => document.getElementById('resumeUpload')?.click()} className="cursor-pointer text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center text-xs font-medium leading-4 mt-[16px] block">
                { uploadingResume ? "Uploading..." : "Upload CV or Portfolio" }   
                </a>

            </div> }

            { form.getValues().resume && <div className="xs:max-w-full sm:max-w-[313px] w-full flex-none 
                  rounded-2xl mb-[24px] sm:mb-0">

                { /** TODO: show resume preview */ }
                <img src="/assets/icons/cv.svg" className="w-full"></img>   

                <Button variant={ "ghost"} onClick={() => removeResume()} 
                  className="text-[color:var(--Neutral-70,#7D7D8D)] text-sm font-medium leading-5 text-center m-auto mt-[12px]">
                    <img src="/assets/icons/trash.svg" className="w-[16px]"></img>   
                    { removingResume ? "Removing..." : "Remove" } 
                </Button>
            </div> }
            
        </div> 
    
        <input
          type="file"
          id="resumeUpload"
          className="hidden"
          accept="application/pdf"
          onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                  setUploadingResume(true);

                  uploadFileToTempS3(file).then((res: any) => {
                    
                    updateResume(res.Key).then((res: any) => { 
                     
                      if (res.operation == 'success') {   

                        form.setValue('resume', res.candidate_resume);

                        dispatch(setUser({ user: {
                          ...user,
                          candidate_resume: res.candidate_resume
                        } }));
                      } else {
                          alert(errorMessage(res.message));
                      }
                    }).finally(() => {
                      setUploadingResume(false);
                    });
                  }).catch((error) => {
                    // Handle upload error
                    console.error('Upload failed:', error);
                    setUploadingResume(false);
                  })
              }
          }}
      />

        <input
          type="file"
          id="videoUpload"
          className="hidden"
          accept="video/*"
          onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                  setUploadingVideo(true);

                  uploadFileToTempS3(file).then((res: any) => {
                    
                    updateVideo(res.Key).then((res: any) => {
                     
                      if (res.operation == 'success') {   

                        form.setValue('video', res.candidate_video);
                        dispatch(setUser({ user: {
                          ...user,
                          candidate_video: res.candidate_video
                        } }));

                      } else {
                        alert(errorMessage(res.message));
                      }
                    }).finally(() => {
                      setUploadingVideo(false);
                    });
                    
                  }).catch((error) => {
                    // Handle upload error
                    console.error('Upload failed:', error);
                    setUploadingVideo(false);
                  })
              }
          }}
      />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[16px] max-w-[650px] m-auto mb-[100px]">
          {/**!form.formState.isValid ||  */}
            <SubmitButton disabled={loading || uploadingVideo || uploadingResume} 
              loading={loading || uploadingVideo || uploadingResume }></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </div>
  );
}
