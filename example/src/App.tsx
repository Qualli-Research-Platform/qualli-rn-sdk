import * as React from 'react';

import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import {
    QualliProvider,
    useQualli,
    SurveyEvents,
    EventCompletedPayload,
    EventShownPayload,
    EventClosedPayload,
    EventSkippedPayload,
} from '@qualli/qualli-rn-sdk';

const Home = () => {
    const qualli = useQualli();

    React.useEffect(() => {
        if (!qualli?.authenticated) return;

        const completedListener = qualli.on(
            SurveyEvents.SURVEY_COMPLETED,
            (response: EventCompletedPayload) => {
                console.log('survey_completed', response);
            },
        );

        const openedListener = qualli.on(
            SurveyEvents.SURVEY_SHOWN,
            (response: EventShownPayload) => {
                console.log('survey_shown', response);
            },
        );

        const closedListener = qualli.on(
            SurveyEvents.SURVEY_CLOSED,
            (response: EventClosedPayload) => {
                console.log('survey_closed', response);
            },
        );

        const skippedListener = qualli.on(
            SurveyEvents.SURVEY_SKIPPED,
            (response: EventSkippedPayload) => {
                console.log('survey_skipped', response);
            },
        );

        return () => {
            completedListener();
            openedListener();
            closedListener();
            skippedListener();
        };
    }, [qualli?.authenticated]);

    return (
        <View style={styles.container}>
            <Image
                source={require('./../assets/bg-1.png')}
                style={styles.bg}
                resizeMethod="scale"
                resizeMode="cover"
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={() => qualli.performTrigger('SUBSCRIBE')}
            >
                <Text>Subscribe</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                    qualli.setAttributes({
                        first_name: 'John',
                        company_identifier: '1234567890',
                    })
                }
            >
                <Text>Set Attributes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => qualli.reset()}>
                <Text>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function App() {
    return (
        <QualliProvider apiKey="YOUR_API_KEY">
            <Home />
        </QualliProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
    bg: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
    },
    btn: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
});
