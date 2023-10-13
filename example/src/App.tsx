import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SurveyProvider, useSurvey } from '../../src/providers/surveyProvider';
import { QualliProvider } from '../../src/providers/QualliProvider';
import {
    SingleText,
    SingleSelect,
    Star,
    NPS,
    Numeric,
    MultiSlide,
    SimpleMultiSlideWithLogic,
} from './test-surveys';

const Home = () => {
    const survey = useSurvey();

    const showSurvey = () => {
        survey.showSurvey(SimpleMultiSlideWithLogic);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showSurvey}>
                <Text>{'toggle panel'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function App() {
    return (
        <QualliProvider apiKey="08e83b96-a975-4523-8562-e44806d2a352">
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
});
