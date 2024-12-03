"use client"
// app/(dash)/profile/ProfilePage.jsx

import { Candidate } from '@/models/candidate';
import { page, track } from '@/providers/analytics.service';
import { profile } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';

const ProfilePage = () => {

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [segment, setSegment] = useState("work-details");


    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    const dispatch = useAppDispatch();

    useEffect(() => {
        page('Profile Page');

        return () => {
            track('page_exit', { page: 'Profile Page' });
        }
    }, []);

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
        <div className="max-w-2xl mx-auto p-4">
            {loading && <div>Loading...</div>}
            {candidate && (
                <>
                    <div className="flex items-center mb-4">
                        <img src={process.env.NEXT_PUBLIC_CLOUDINARY_URL + 'candidate-photo/' + 
           user.candidate_personal_photo} alt="Candidate" className="w-20 h-20 rounded-full mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold">{user.candidate_name}</h2>
                            <h4 className="text-lg">{user.candidate_name_ar}</h4>
                        </div>
                    </div>
                    <div className="mb-4">
                        <button onClick={updatePhoto} className="btn">Update Photo</button>
                    </div>
                    <div className="mb-4">
                        <h5 className="text-lg">Skills</h5>
                        {user.candidateSkills && user.candidateSkills.map((skill: any) => (
                            <span key={skill.id} className="badge">{skill.name}</span>
                        ))}
                        <button onClick={updateSkills} className="btn">Edit Skills</button>
                    </div>
                    <div className="mb-4">
                        <h5 className="text-lg">Experiences</h5>
                        {user.candidateExperiences && user.candidateExperiences.map((exp: any) => (
                            <p key={exp.id}>{exp.title} at {exp.company}</p>
                        ))}
                        <button onClick={updateExperiences} className="btn">Edit Experiences</button>
                    </div>
                    {/* Add more sections as needed */}
                </>
            )}
        </div>
    );
};

export default ProfilePage;