// const API_BASE_PATH = 'https://api.usequalli.com/api/';
const API_BASE_PATH = 'http://localhost:8080/api/';

import type { SurveyActions } from '../types';
import apiRequest from './ApiRequest';
import logger from './../helpers/logger';

const ApiManager = {
    identify: async (apiKey: string, userKey?: string) => {
        const url = `${API_BASE_PATH}app-user/identify`;
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
            console.error('QUALLI: Failed to identify user');
        } catch (error) {
            console.error('QUALLI: Failed to identify user: ', error);
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
            console.error('QUALLI: No session ID available');
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
            console.error('QUALLI: Error setting user attributes: ', error);
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
            console.error('QUALLI: No session ID available');
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
            console.error('QUALLI: Error performing trigger');
        } catch (error) {
            console.error('QUALLI: Error performing trigger: ', error);
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
            console.error('QUALLI: No session ID available');
            return;
        }
        const headers = { 'user-session-key': userSessionKey };

        try {
            await apiRequest({
                apiKey,
                url,
                method: 'POST',
                headers,
                body: { action, data, timestamp: new Date() },
            });
            logger('QUALLI: Successfully logged the survey action');
        } catch (error: any) {
            logger(error?.response || '');
            console.error('QUALLI: Error logging the survey action: ', error);
        }
    },

    logEvent: async (
        apiKey: string,
        userSessionKey: string,
        action: string,
    ) => {
        const url = `${API_BASE_PATH}app-user-events/store`;

        if (!userSessionKey) {
            console.error('QUALLI: No session ID available');
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
            console.error('QUALLI: Error logging the action: ', error);
        }
    },
};

export default ApiManager;
