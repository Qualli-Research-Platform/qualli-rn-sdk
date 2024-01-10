import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Survey as SurveyType, SurveyActions } from './../types/index';
import Survey from './survey';

interface SurveyComponentProps {
    logSurveyAction: (
        surveyUniqueId: any,
        action: SurveyActions,
        data: any,
    ) => Promise<any>;
    survey?: SurveyType;
    companyPlan: string;
}

const BASE_SURVEY_STATE = {
    survey: undefined,
    answers: {},
    isVisible: false,
    completed: false,
};

const SurveyWrapper: React.FC<SurveyComponentProps> = ({
    survey,
    companyPlan,
    logSurveyAction,
}) => {
    const [currentSurveyState, setCurrentSurveyState] = useState<{
        survey?: SurveyType;
        answers: any;
        isVisible: boolean;
        completed: boolean;
    }>({
        ...BASE_SURVEY_STATE,
    });
    const uniqueGroupAnswerId = useRef<string>();

    useEffect(() => {
        if (currentSurveyState.completed) {
            logSurveyAction(
                currentSurveyState?.survey?.unique_identifier as string,
                SurveyActions.SURVEY_COMPLETED,
                {},
            );
            hideSurvey();
        }
    }, [currentSurveyState.completed]);

    useEffect(() => {
        if (
            survey &&
            currentSurveyState.survey !== survey &&
            currentSurveyState.isVisible === false
        ) {
            showSurvey(survey);
        }

        // if the survey was cleared, check if we're already showing a survey. If so do nothing, else reset the state
        if (
            !survey &&
            currentSurveyState.survey &&
            !currentSurveyState.isVisible
        ) {
            setCurrentSurveyState(_ => {
                return {
                    ...BASE_SURVEY_STATE,
                };
            });
        }
    }, [survey]);

    const saveAnswer = async (slideId: string, value: any) => {
        const data: any = {
            answers: {
                [slideId]: value,
            },
        };

        if (uniqueGroupAnswerId.current) {
            data['unique_group_answer_id'] = uniqueGroupAnswerId.current;
        }

        logSurveyAction(
            currentSurveyState?.survey?.unique_identifier as string,
            SurveyActions.SURVEY_SLIDE_ANSWERED,
            data,
        ).then((response: any) => {
            if (response?.data?.unique_group_answer_id) {
                uniqueGroupAnswerId.current =
                    response?.data?.unique_group_answer_id;
            }
        });
    };

    const showSurvey = (newSurvey: SurveyType) => {
        setCurrentSurveyState(prevState => {
            return {
                ...prevState,
                survey: newSurvey,
                isVisible: true,
            };
        });

        // clear out previous group answer id
        uniqueGroupAnswerId.current = undefined;

        logSurveyAction(
            newSurvey.unique_identifier,
            SurveyActions.SURVEY_SHOWN,
            {},
        );
    };

    const hideSurvey = () => {
        setCurrentSurveyState(prevState => {
            return {
                ...prevState,
                isVisible: false,
            };
        });

        setTimeout(() => {
            setCurrentSurveyState(prevState => {
                return {
                    ...prevState,
                    survey: undefined,
                    answers: {},
                    isVisible: false,
                    completed: false,
                };
            });
        }, 300);
    };

    const onClose = () => {
        if (currentSurveyState.completed) {
            hideSurvey();
            return;
        }

        abortSurvey();
    };

    const onSurveyComplete = () => {
        setCurrentSurveyState(prevState => {
            return {
                ...prevState,
                completed: true,
            };
        });
    };

    const abortSurvey = () => {
        const { survey, answers } = currentSurveyState;

        logSurveyAction(
            survey?.unique_identifier as string,
            SurveyActions.SURVEY_SKIPPED,
            { answers },
        );
        hideSurvey();
    };

    // when no survey is available, or the survey is not visible, do not render anything
    // FIX: support for older versions of react-native, not supporting pointerEvents
    if (!currentSurveyState.survey && !currentSurveyState.isVisible) {
        return null;
    }

    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Survey
                    isVisible={currentSurveyState.isVisible}
                    survey={currentSurveyState.survey}
                    answers={currentSurveyState.answers}
                    companyPlan={companyPlan}
                    onComplete={onSurveyComplete}
                    onAnswer={saveAnswer}
                    onClose={onClose}
                    closeSurvey={hideSurvey}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default SurveyWrapper;
