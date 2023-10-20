import React, {
    createContext,
    useRef,
    useEffect,
    useState,
    useContext,
    type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ApiManager from '../networking/ApiManager';
import getDeviceMetaData from '../helpers/getDeviceMetaData';

import { SurveyActions } from '../types/survey';

import SurveyWrapper from '../survey/survey-wrapper';

interface AuthState {
    authenticating: boolean;
    sessionKey: string | null;
    userKey: string | null;
}

interface QualliContextProps {
    authState: any;
    performTrigger: (trigger: string) => void;
    setAttributes: (attributes: {}) => void;
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
    });

    const [surveyState, setSurveyState] = useState({
        survey: undefined,
    });

    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                console.log(nextAppState);
                appState.current = nextAppState;

                saveAppState();
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // try authenticating our user, else log the user key is invalid
        if (!apiKey) {
            console.log('Qualli: Invalid API key provided');
        }

        if (apiKey) {
            // try authenticating
            identifyUser();
        }
    }, [apiKey]);

    const identifyUser = async () => {
        if (authState?.current?.authenticating) return;

        // see if we have a app_user_key in localstorage first
        const userKey = await AsyncStorage.getItem('app_user_key');
        const response = await ApiManager.identify(
            apiKey,
            userKey ? userKey : undefined
        );
        if (
            !response?.success ||
            !response?.app_user_key ||
            !response?.session_key
        ) {
            console.error('QUALLI: Failed to identify user');
            return;
        }

        // save the user key in local storage for later use
        await AsyncStorage.setItem('app_user_key', response.app_user_key);

        // user has been authenticated -> now start the session
        authState.current = {
            authenticating: true,
            sessionKey: response.session_key,
            userKey: response.app_user_key,
        };

        // in the background set the users latest attributes
        setDefaultUserAttributes();
    };

    const setDefaultUserAttributes = async () => {
        const baseAttributes = await getDeviceMetaData();
        setAttributes(baseAttributes);
    };

    const saveAppState = async () => {
        const appStateToAction = {
            active: 'app_opened',
            inactive: 'app_closed',
            background: 'app_closed',
        };

        await ApiManager.logEvent(
            apiKey,
            authState.current.sessionKey as string,
            appStateToAction[appState.current] as string
        );
    };

    const setAttributes = async (attributes: {} = {}) => {
        await ApiManager.setUserAttributes(
            apiKey,
            authState.current.sessionKey as string,
            attributes
        );
    };

    const logSurveyAction = async (
        surveyUniqueId: any,
        action: SurveyActions,
        data: any
    ) => {
        ApiManager.logSurveyAction(
            apiKey,
            authState.current.sessionKey,
            surveyUniqueId,
            action,
            data
        );
        console.log(surveyUniqueId, action, data);
    };

    const performTrigger = async (trigger: string) => {
        const res = await ApiManager.performTrigger(
            apiKey,
            authState.current.sessionKey as string,
            { name: trigger }
        );

        // if success -> see if we have any open surveys
        if (res?.success) {
            // see if we have any open surveys
            const surveys = res?.data?.surveys?.data;

            if (surveys?.length > 0) {
                setSurveyState({ survey: surveys[0] });
                return;
            }
        }
        setSurveyState({ survey: undefined });
    };

    return (
        <QualliContext.Provider
            value={{
                authState: authState?.current,
                performTrigger,
                setAttributes,
            }}
        >
            {children}
            <SurveyWrapper
                survey={surveyState?.survey}
                logSurveyAction={logSurveyAction}
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
