const API_BASE_PATH = 'https://api.usequalli.com/api/';

import type { SurveyActions } from '../types';
import apiRequest from './ApiRequest';
import logger from './../helpers/logger';

const ApiManager = {
    identify: async (apiKey: string, userKey?: string) => {
        const url = `${API_BASE_PATH}app-user/start-session`;
        try {
            const jsonResponse = await apiRequest({
                apiKey,
                url,
                method: 'POST',
                body: {},
                headers: userKey ? { user_key: userKey } : {},
            });
            if (jsonResponse.success) {
                logger('QUALLI: identify ', jsonResponse);
                return jsonResponse;
            }

            logger('QUALLI: Failed to identify user');
            return { success: false };
        } catch (error) {
            logger('QUALLI: Failed to identify user: ', error);
            return { success: false };
        }
    },

    setUserAttributes: async (
        apiKey: string,
        userSessionKey: string,
        attributes: any,
    ) => {
        if (Object.keys(attributes).length === 0) {
            logger('QUALLI: No attributes to send');
            return;
        }

        const url = `${API_BASE_PATH}app-user/set-attributes`;

        if (!userSessionKey) {
            logger('QUALLI: No session ID available');
            return;
        }
        const headers = { 'user-session-key': userSessionKey };

        try {
            await apiRequest({
                apiKey,
                url,
                method: 'POST',
                headers,
                body: { attributes, timestamp: new Date() },
            });
            logger('QUALLI: Successfully set user attributes');
        } catch (error) {
            logger('QUALLI: Error setting user attributes: ', error);
        }
    },

    performTrigger: async (
        apiKey: string,
        userSessionKey: string,
        trigger: { name: string },
    ) => {
        if (!trigger?.name) {
            logger('QUALLI: Invalid trigger');
            return;
        }

        const url = `${API_BASE_PATH}app-user-events/trigger`;

        if (!userSessionKey) {
            logger('QUALLI: No session ID available');
            return;
        }
        const headers = { 'user-session-key': userSessionKey };

        try {
            const jsonResponse = await apiRequest({
                apiKey,
                url,
                method: 'POST',
                headers,
                body: { trigger, timestamp: new Date() },
            });

            if (jsonResponse.success) {
                logger('QUALLI: Successfully performed trigger');
                return jsonResponse;
            }
            logger('QUALLI: Error performing trigger');
        } catch (error) {
            logger('QUALLI: Error performing trigger: ', error);
        }
    },

    logSurveyAction: async (
        apiKey: string,
        userSessionKey: string,
        uniqueId: string,
        action: SurveyActions,
        data: {},
    ) => {
        const url = `${API_BASE_PATH}surveys/${uniqueId}/action`;

        if (!userSessionKey) {
            logger('QUALLI: No session ID available');
            return;
        }
        const headers = { 'user-session-key': userSessionKey };

        try {
            const res = await apiRequest({
                apiKey,
                url,
                method: 'POST',
                headers,
                body: { action, data, timestamp: new Date() },
            });
            logger('QUALLI: Successfully logged the survey action: ' + action);
            return res;
        } catch (error: any) {
            logger(error?.response || '');
            logger('QUALLI: Error logging the survey action: ', error);
        }
    },

    logEvent: async (
        apiKey: string,
        userSessionKey: string,
        action: string,
    ) => {
        const url = `${API_BASE_PATH}app-user-events/store`;

        if (!userSessionKey) {
            logger('QUALLI: No session ID available');
            return;
        }
        const headers = { 'user-session-key': userSessionKey };

        try {
            await apiRequest({
                apiKey,
                url,
                method: 'POST',
                headers,
                body: { action, event_name: action, timestamp: new Date() },
            });
            logger('QUALLI: Successfully logged the action');
        } catch (error: any) {
            logger(error?.response || '');
            logger('QUALLI: Error logging the action: ', error);
        }
    },
};

export default ApiManager;
