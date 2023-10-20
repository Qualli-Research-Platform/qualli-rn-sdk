import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Survey as SurveyType, SurveyActions } from './../types/index';
import Survey from './survey';

interface SurveyComponentProps {
    logSurveyAction: (
        surveyUniqueId: any,
        action: SurveyActions,
        data: any,
    ) => void;
    survey?: SurveyType;
}
const BASE_SURVEY_STATE = {
    survey: undefined,
    answers: {},
    isVisible: false,
    completed: false,
};

const SurveyWrapper: React.FC<SurveyComponentProps> = ({
    survey,
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

    useEffect(() => {
        if (currentSurveyState.completed) {
            logSurveyAction(
                currentSurveyState?.survey?.unique_identifier as string,
                SurveyActions.SURVEY_COMPLETED,
                { answers: currentSurveyState.answers },
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

    const saveAnswer = (slideId: string, value: any) => {
        setCurrentSurveyState(prevState => {
            const newAnswers = { ...prevState.answers, [slideId]: value };
            return { ...prevState, answers: newAnswers };
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

    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
                pointerEvents: currentSurveyState.isVisible ? 'auto' : 'none',
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
                    onComplete={onSurveyComplete}
                    onAbortSurvey={abortSurvey}
                    onAnswer={saveAnswer}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default SurveyWrapper;
