import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from 'react';
import Survey from '../survey/survey';
import { SurveyType } from './../types';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';

interface SurveyContextProps {
    showSurvey: (survey: any) => void;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

interface SurveyProviderProps {
    children: ReactNode;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
    const [currentSurveyState, setCurrentSurveyState] = useState({
        survey: undefined,
        answers: {},
        isVisible: false,
        completed: false,
    });

    useEffect(() => {
        if (currentSurveyState.completed) {
            // todo save answers and log event
            console.log('SURVEY COMPLETED WITH: ', currentSurveyState.answers);
            hideSurvey();
        }
    }, [currentSurveyState.completed]);

    const saveAnswer = (slideId: string, value: any) => {
        setCurrentSurveyState((prevState) => {
            const newAnswers = { ...prevState.answers, [slideId]: value };
            return { ...prevState, answers: newAnswers };
        });
    };

    const showSurvey = (newSurvey: SurveyType) => {
        setCurrentSurveyState((prevState) => {
            return {
                ...prevState,
                survey: newSurvey,
                isVisible: true,
            };
        });
    };

    const hideSurvey = () => {
        setCurrentSurveyState((prevState) => {
            return {
                ...prevState,
                isVisible: false,
            };
        });

        setTimeout(() => {
            setCurrentSurveyState((prevState) => {
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
        setCurrentSurveyState((prevState) => {
            return {
                ...prevState,
                completed: true,
            };
        });
    };

    const abortSurvey = () => {
        // save any answers we potentially have
        const { survey, answers } = currentSurveyState;
        //TODO: save answers
        // hide the survey
        hideSurvey();
        // log the cancel event
    };

    // send API call

    return (
        <SurveyContext.Provider
            value={{
                showSurvey,
            }}
        >
            {children}
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    zIndex: 1,
                    pointerEvents: currentSurveyState.isVisible
                        ? 'auto'
                        : 'none',
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
        </SurveyContext.Provider>
    );
};

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within a SurveyProvider');
    }
    return context;
};
