const API_BASE_PATH =
    'https://4d6b-2a02-1810-c27-3800-75d5-ccc9-aaf6-a94a.ngrok-free.app/api/';

import type { SurveyActions } from '../types';
import apiRequest from './ApiRequest';

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
                console.log('QUALLI: identify ', jsonResponse);
                return jsonResponse;
            } else {
                console.error('QUALLI: Failed to identify user');
            }
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
            console.log('QUALLI: No attributes to send');
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
            console.log('QUALLI: Successfully set user attributes');
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
            console.log('QUALLI: Invalid trigger');
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
                console.log('QUALLI: Successfully performed trigger');
                return jsonResponse;
            } else {
                console.error('QUALLI: Error performing trigger');
            }
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
            console.log('QUALLI: Successfully logged the survey action');
        } catch (error) {
            console.log(error.response);
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
            console.log('QUALLI: Successfully logged the action');
        } catch (error) {
            console.log(error.response);
            console.error('QUALLI: Error logging the action: ', error);
        }
    },
};

export default ApiManager;
