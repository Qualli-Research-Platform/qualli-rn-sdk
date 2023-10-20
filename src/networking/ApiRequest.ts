import getDeviceMetaData from './../helpers/getDeviceMetaData';

interface Props {
    apiKey: string;
    url: string;
    method: 'GET' | 'POST';
    headers?: {};
    body?: {};
}

const ApiRequest = async (props: Props) => {
    const { apiKey, url, method, headers, body } = props;
    const deviceMetaData = JSON.stringify(await getDeviceMetaData());

    try {
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body
                ? JSON.stringify({ ...body, event_metadata: deviceMetaData })
                : JSON.stringify({ event_metadata: deviceMetaData }),
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error: any) {
        console.error(`API request error: ${error.message}`);
        throw error;
    }
};

export default ApiRequest;
