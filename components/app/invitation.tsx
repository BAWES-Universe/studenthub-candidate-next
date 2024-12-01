// components/App/Invitation.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { useRouter } from 'next/router';

const Invitation = ({ model }: { model: any }) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const invitationDetail = () => {
        router.push({
            pathname: `/invitation-detail/${model.invitation_uuid}`,
            query: { invitation: JSON.stringify(model) },
        });
    };

    return (
        model.request && model.company && (
            <div className="card-invitation rounded-lg shadow-md bg-white mb-4">
                <div className="ion-card-header">
                    <div className={`status ${model.request.request_status === 'delivered' ? 'request-completed' : model.request.request_status === 'cancelled' ? 'request-cancelled' : 'request-pending'}`}>
                        {model.request.request_status === 'started' || model.request.request_status === 're_work' || model.request.request_status === 'finished_by_recruitment' ? (
                            <>
                                {model.invitation_status === 1 && !model.suggestion && <span className="txt">{t("New Job Invitation!")}</span>}
                                {model.invitation_status === 3 && !model.suggestion && <span className="txt">{t("We're now working on convincing them to hire you. Check back here later to see if you made it.")}</span>}
                                {model.invitation_status === 3 && model.suggestion && model.suggestion.suggestion_status && <span className="txt">{t("Congratulation, You profile has been shortlisted by Client.")}</span>}
                                {model.invitation_status === 2 && <span className="txt">{t("We’ll keep you updated on any other jobs that pop up.")}</span>}
                            </>
                        ) : model.request.request_status === 'delivered' ? (
                            <>
                                {model.invitation_status === 1 && <span>{t("You didn’t apply for it.")}</span>}
                                {model.invitation_status === 2 && <span>{t("You rejected it.")}</span>}
                                {model.invitation_status === 3 && <span>{t("You applied.")}</span>}
                                <span className="txt">{t("This job has filled up. If you didn’t make it, we’ll be working on finding you other jobs.")}</span>
                            </>
                        ) : model.request.request_status === 'cancelled' && <span>{t("This job was cancelled. They’ll hopefully have another opening soon.")}</span>}
                    </div>
                </div>

                <div className="ion-card-content">
                    <p className="txt-position-title">{model.request.request_position_title}</p>
                    <p className="company">{model.company[i18n.language === 'en' ? 'company_common_name_en' : 'company_common_name_ar'] || model.company.company_name}</p>
                    <small className="time-ago">{model.invitation_created_at}</small>

                    <div className="badge">
                        {model.request.request_position_type === 1 && <span className="ion-badge">{t("full-time")}</span>}
                        {model.request.request_position_type === 2 && <span className="ion-badge">{t("part-time")}</span>}
                    </div>

                    {(model.request.request_status === 'started' || model.request.request_status === 're_work' || model.request.request_status === 'finished_by_recruitment') && model.invitation_status === 1 && (
                        <button onClick={invitationDetail} className="tell-me-more-btn">{t("View details & apply for job")}</button>
                    )}
                </div>

                {model.reply && (
                    <div className="ion-card-content reply">
                        <h3>{t("You reply:")}</h3>
                        <p className="application-msg">"<span dangerouslySetInnerHTML={{ __html: model.reply.note_text }}></span>"</p>
                    </div>
                )}
            </div>
        )
    );
};

Invitation.propTypes = {
    model: PropTypes.shape({
        request: PropTypes.shape({
            request_status: PropTypes.string.isRequired,
            request_position_title: PropTypes.string.isRequired,
            request_position_type: PropTypes.number.isRequired,
        }).isRequired,
        company: PropTypes.shape({
            company_common_name_en: PropTypes.string,
            company_common_name_ar: PropTypes.string,
            company_name: PropTypes.string.isRequired,
        }).isRequired,
        invitation_created_at: PropTypes.string.isRequired,
        invitation_status: PropTypes.number.isRequired,
        invitation_uuid: PropTypes.string.isRequired,
        reply: PropTypes.shape({
            note_text: PropTypes.string.isRequired,
        }),
        suggestion: PropTypes.shape({
            suggestion_status: PropTypes.bool,
        }),
    }).isRequired,
};

export default Invitation;

// Tailwind CSS styles are applied directly in the component