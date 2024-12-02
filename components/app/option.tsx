// app/(dash)/settings/SettingsMenu.tsx

import React from 'react';
import { useHistory } from 'react-router-dom';

const SettingsMenu = ({ translateService, authService, updating, setUpdating }) => {
    const history = useHistory();

    const dismiss = () => {
        // Implement dismiss logic if needed
    };

    const updateJobSearchStatus = () => {
        setUpdating(true);
        // Implement job search status update logic
    };

    const translate = () => {
        // Implement translation logic
    };

    const deleteProfile = () => {
        // Implement profile deletion logic
    };

    const logout = () => {
        // Implement logout logic
    };

    return (
        <div className={`p-0 ${translateService.direction() === 'rtl' ? 'text-right' : 'text-left'}`}>
            <ul className="list-none">
                <li className="flex items-center p-4 cursor-pointer" onClick={() => { history.push('/change-password'); dismiss(); }}>
                    <i className="icon-key-outline mr-2"></i>
                    <span>{translateService.translate("Change Password")}</span>
                </li>

                {!authService.store && authService.candidate_job_search_status && (
                    <li className="flex items-center p-4 cursor-pointer" onClick={() => !updating && updateJobSearchStatus()}>
                        {updating ? <i className="icon-spinner"></i> : <i className="icon-eye-off-outline mr-2"></i>}
                        <span>{translateService.translate("I don’t want a job anymore")}</span>
                    </li>
                )}

                <li className="flex items-center p-4 cursor-pointer" onClick={translate}>
                    <i className="icon-globe-outline mr-2"></i>
                    <span>{translateService.currentLang !== 'en' ? 'English' : 'عربى'}</span>
                </li>

                <li className="flex items-center p-4 cursor-pointer" onClick={deleteProfile}>
                    <i className="icon-trash-outline mr-2"></i>
                    <span>{translateService.translate("Delete Profile")}</span>
                </li>

                <li className="flex items-center p-4 cursor-pointer" onClick={logout}>
                    <i className="icon-log-out-outline mr-2"></i>
                    <span>{translateService.translate("Logout")}</span>
                </li>
            </ul>
        </div>
    );
};

export default SettingsMenu;