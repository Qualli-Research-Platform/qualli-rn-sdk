import React, {
    createContext,
    useRef,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { SurveyProvider } from './surveyProvider';
import ApiManager from '../networking/ApiManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDeviceMetaData from '../helpers/getDeviceMetaData';

// Define the shape of your context
interface QualliContextProps {
    user: any; // Define your user type
    login: (username: string, password: string) => void;
    logout: () => void;
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
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Or your initial user state

    const authState = useRef<{
        authenticating: boolean;
        sessionKey?: string;
        userKey?: string;
    }>({
        authenticating: false,
        sessionKey: undefined,
        userKey: undefined,
    });

    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    console.log('App has come to the foreground!');
                }

                appState.current = nextAppState;

                console.log('AppState', appState.current);
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
        setAuthenticated(true);

        // in the background set the users latest attributes
        updateUserBaseAttributes();
        r;
    };

    const updateUserBaseAttributes = async () => {
        const baseAttributes = await getDeviceMetaData();
        ApiManager.setUserAttributes(
            apiKey,
            authState.current.sessionKey,
            baseAttributes
        );
    };

    const logEvent = (event: string, timestamp: Date) => {
        // Implement logout logic with API
    };

    return (
        <QualliContext.Provider value={{ user }}>
            <SurveyProvider>{children}</SurveyProvider>
        </QualliContext.Provider>
    );
};
