import React, {
    createContext,
    useRef,
    useEffect,
    useState,
    useContext,
    type ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logger from './../helpers/logger';
import ApiManager from './../networking/ApiManager';
import { Survey, SurveyActions } from './../types/survey';

import SurveyWrapper from './../survey/survey-wrapper';

interface AuthState {
    authenticating: boolean;
    sessionKey: string | null;
    userKey: string | null;
    company: {
        plan: 'free' | 'essentials' | 'advanced';
    };
}

interface QualliContextProps {
    authState: any;
    performTrigger: (trigger: string) => void;
    setAttributes: (attributes: { [key: string]: string | number }) => void;
    reset: () => void;
}

interface QualliProviderProps {
    children: ReactNode;
    apiKey: string;
}

const QualliContext = createContext<QualliContextProps | undefined>(undefined);

export const QualliProvider: React.FC<QualliProviderProps> = ({
    children,
    apiKey,
}) => {
    const authState = useRef<AuthState>({
        authenticating: false,
        sessionKey: null,
        userKey: null,
        company: {
            plan: 'free',
        },
    });

    const [surveyState, setSurveyState] = useState<{
        survey: Survey | undefined;
    }>({
        survey: undefined,
    });

    const appState = useRef(AppState.currentState);
    const surveyInQueue = useRef(false);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            nextAppState => {
                appState.current = nextAppState;

                saveAppState();
            },
        );

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // try authenticating our user, else log the user key is invalid
        if (!apiKey) {
            logger('Qualli: Invalid API key provided');
        }

        if (apiKey) {
            // try authenticating
            identifyUser();
        }
    }, [apiKey]);

    const identifyUser = async () => {
        if (authState?.current?.authenticating) {
            return;
        }

        // see if we have a app_user_key in localstorage first
        const userKey = await AsyncStorage.getItem('app_user_key');
        const response = await ApiManager.identify(
            apiKey,
            userKey ? userKey : undefined,
        );

        if (
            !response?.success ||
            !response?.app_user_key ||
            !response?.session_key
        ) {
            logger('QUALLI: Failed to identify user');
            return;
        }

        // save the user key in local storage for later use
        await AsyncStorage.setItem('app_user_key', response.app_user_key);

        // user has been authenticated -> now start the session
        authState.current = {
            authenticating: true,
            sessionKey: response.session_key,
            userKey: response.app_user_key,
            company: {
                plan: response.company_info?.plan,
            },
        };
    };

    const saveAppState = async () => {
        const appStateToAction: { [index: string]: string } = {
            active: 'app_opened',
            inactive: 'app_closed',
            background: 'app_closed',
        };

        if (appStateToAction[appState.current as AppStateStatus]) {
            await ApiManager.logEvent(
                apiKey,
                authState.current.sessionKey as string,
                appStateToAction[appState.current as AppStateStatus],
            );
        }
    };

    const setAttributes = async (
        attributes: { [key: string]: string | number } = {},
    ) => {
        await ApiManager.setUserAttributes(
            apiKey,
            authState.current.sessionKey as string,
            attributes,
        );
    };

    const logSurveyAction = async (
        surveyUniqueId: any,
        action: SurveyActions,
        data: any,
    ) => {
        return await ApiManager.logSurveyAction(
            apiKey,
            authState.current.sessionKey as string,
            surveyUniqueId,
            action,
            data,
        );
    };

    const performTrigger = async (trigger: string) => {
        const res = await ApiManager.performTrigger(
            apiKey,
            authState.current.sessionKey as string,
            { name: trigger },
        );

        // if success -> see if we have any open surveys
        if (res?.success) {
            // see if we have any open surveys
            const surveys = res?.data?.surveys?.data;

            if (surveys?.length > 0) {
                if (surveyInQueue.current) return; // a survey is already in queue

                const survey = surveys[0];

                if (survey.delay > 0) {
                    handleSurveyDelay(survey, res?.data?.timestamp);
                    return;
                }

                setSurveyState({ survey: surveys[0] });
                return;
            }
        }

        setSurveyState({ survey: undefined });
        surveyInQueue.current = false;
    };

    const handleSurveyDelay = (survey: Survey, timestamp: string) => {
        // block from loading new surveys
        const delayInSeconds = survey.delay;
        // calculate the time with delay
        const delayedTime = new Date(timestamp);
        delayedTime.setSeconds(delayedTime.getSeconds() + delayInSeconds);

        // run a timer to check if the delay is over
        const interval = setInterval(() => {
            const now = new Date();
            if (now >= delayedTime) {
                // delay is over -> show the survey
                // this._showPopup(survey);
                setSurveyState({ survey });
                clearInterval(interval);
                surveyInQueue.current = false;
            }
        }, 200);
    };

    const reset = async () => {
        await AsyncStorage.removeItem('app_user_key');

        authState.current = {
            authenticating: false,
            sessionKey: null,
            userKey: null,
            company: {
                plan: 'free',
            },
        };

        setSurveyState({ survey: undefined });
        surveyInQueue.current = false;
        identifyUser();
    };

    return (
        <QualliContext.Provider
            value={{
                authState: authState?.current,
                performTrigger,
                setAttributes,
                reset,
            }}
        >
            {children}
            <SurveyWrapper
                survey={surveyState?.survey}
                logSurveyAction={logSurveyAction}
                companyPlan={authState?.current?.company?.plan || 'free'}
            />
        </QualliContext.Provider>
    );
};

export const useQualli = () => {
    const context = useContext(QualliContext);
    if (!context) {
        throw new Error('useQually must be used within a QualliProvider');
    }
    return context;
};
