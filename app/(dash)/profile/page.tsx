"use client"
import { Assignment } from '@/components/app/profile/assignment';
import { CertificateComponent } from '@/components/app/profile/certificate';
import { Education } from '@/components/app/profile/education';
import { Experience } from '@/components/app/profile/experience';
import { Name } from '@/components/app/profile/name';
import { Segments } from '@/components/app/profile/segments';
import { WorkHistoryComponent } from '@/components/app/profile/work-history';
import { Badge } from '@/components/ui/badge';
// app/(dash)/profile/ProfilePage.jsx

import { Candidate } from '@/models/candidate';
import { CandidateEducation } from '@/models/candidate-education';
import { CandidateWorkHistory } from '@/models/candidate-work-history';
import { CandidateExperience } from '@/models/candidate.experience';
import { CandidateSkill } from '@/models/candidate.skill';
import { Certificate } from '@/models/certificate';
import { page, track } from '@/providers/analytics.service';
import { profile, workHistory } from '@/providers/logged-in/account.service';
import { listWorkHistory } from '@/providers/logged-in/candidate.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/store';
import { Ribbon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ProfilePage = () => { 
    const [loading, setLoading] = useState(false);
    const [segment, setSegment] = useState("work-details");

    const [workHistories, setWorkHistories] = useState<CandidateWorkHistory[]>([]);
    const [currentAssignments, setCurrentAssignments] = useState<CandidateWorkHistory[]>([]);   
    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    const dispatch = useAppDispatch();

    useEffect(() => {
        page('Profile Page');

        loadProfile();
        loadWorkHistoryData();

        return () => {
            track('page_exit', { page: 'Profile Page' });
        }
    }, []);

  /*  useEffect(() => {
        loadWorkHistoryData();
    }, [workHistories]);
*/

    function loadProfile() {
        
      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
      }).finally(() => {
        setLoading(false);
      });
    }

    /**
     * Load candidate work history data
     */
    function loadWorkHistoryData() {
        listWorkHistory().then((response: CandidateWorkHistory[]) => {
            setWorkHistories(response.filter((e: CandidateWorkHistory) => e.end_date != null));
            setCurrentAssignments(response.filter((e: CandidateWorkHistory) => e.end_date == null));
        });
    }

    const updatePhoto = async () => {
        // Logic to update photo
    };

    const updateSkills = async () => {
        // Logic to update skills
    };

    const updateExperiences = async () => {
        // Logic to update experiences
    };

    return (
        <>
            {loading && <div>Loading...</div>}
            {user && (
                <>
                    <div className=' bg-white'>
                        <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)">
                            <Name />
                            <Segments onChange={(segment) => setSegment(segment)} segment={segment} />
                        </div>    
                    </div>
                    
                    <div className="max-w-4xl mx-auto p-6">

                        {segment === 'work-details' && (
                            <>

                                {user.certificates && user.certificates.length > 0 && <>
                                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 my-4'>
                                        <img className='w-6 h-6 inline me-2' src="/assets/images/icon-assignment.svg" /> Certificates
                                    </h5>
                                    { user.certificates.map((candidateCertificate: Certificate) => (
                                        <CertificateComponent key={candidateCertificate.certificate_uuid} certificate={candidateCertificate} />
                                    ))}
                                </>}

                                {currentAssignments.length > 0 && <>
                                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 my-4'>
                                        <img className='w-6 h-6 inline me-2' src="/assets/images/icon-assignment.svg" /> Current Assignments
                                    </h5>
                                    { currentAssignments.map((history: any) => (
                                        <Assignment key={history.id} history={history} />
                                    ))}
                                </>}

                                {workHistories.length > 0 && <>
                                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 my-4'>
                                        <img className='w-6 h-6 inline me-2' src="/assets/images/icon-suitcase.svg" /> Work History
                                    </h5>
                                    { workHistories.map((history: any) => (
                                        <WorkHistoryComponent key={history.id} history={history} />
                                    ))}
                                </>}

                                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 my-4'>
                                    <img className='w-6 h-6 inline me-2' src="/assets/images/icon-suitcase.svg" /> Experiences
                                </h5>
                                { user.candidateExperiences?.map((experience: CandidateExperience) => (
                                    <Experience key={experience.candidate_experience_id} experience={experience} />
                                ))}

                                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 my-4'>
                                    <img className='w-6 h-6 inline me-2' src="/assets/images/icon-puzzle.svg" /> Skills
                                </h5>
                                { user.candidateSkills?.map((candidateSkill: CandidateSkill) => (
                                    <span className='inline justify-center items-center gap-2.5 [background:var(--Neutral-0,#FFF)] px-3 py-1.5 rounded-lg
                                        text-[color:var(--Neutral-90,#4B4B61)] me-2 mb-2 text-sm font-medium leading-5' 
                                        key={candidateSkill.candidate_skill_id}>{candidateSkill.skill}</span>
                                ))}

                                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 mb-4 mt-6'>
                                    <Ribbon className='w-6 h-6 inline' /> Educations
                                </h5>
                                { user.candidateEducations?.map((candidateEducation: CandidateEducation) => (
                                    <Education key={candidateEducation.education_uuid} education={candidateEducation}></Education>
                                ))}
                            </>
                        )}

                        {segment === 'personal-details' && (
                            <div>
                                <h2>Personal Details</h2>
                                <p>Personal details go here</p>
                            </div>
                        )}
   
                    </div>
                    
                </>
            )}
        </>
    );
};

export default ProfilePage;