const API_BASE_PATH = 'https://2585-84-197-164-43.ngrok-free.app/api/';

import apiRequest from './ApiRequest';

const ApiManager = {
    identify: async (apiKey: string, userKey?: string) => {
        const url = `${API_BASE_PATH}app-user/identify`;
        console.log(url);
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
        attributes: {}
    ) => {
        if (Object.keys(attributes).length === 0) {
            console.log('QUALLI: No attributes to send');
            return;
        }

        const url = `${API_BASE_PATH}app-user/set-attributes`;

        if (!userKey) {
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
                body: attributes,
            });
            console.log('QUALLI: Successfully set user attributes');
        } catch (error) {
            console.error('QUALLI: Error setting user attributes: ', error);
        }
    },
};

export default ApiManager;
