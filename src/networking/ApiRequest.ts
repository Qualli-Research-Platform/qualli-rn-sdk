import logger from './../helpers/logger';

interface Props {
    apiKey: string;
    url: string;
    method: 'GET' | 'POST';
    headers?: {};
    body?: {};
}

const ApiRequest = async (props: Props) => {
    const { apiKey, url, method, headers, body } = props;

    try {
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                platform: 'app',
                ...headers,
            },
            body: body ? JSON.stringify({ ...body }) : JSON.stringify({}),
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error: any) {
        logger(`API request error: ${error.message}`);
        throw error;
    }
};

export default ApiRequest;
