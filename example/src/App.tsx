import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SurveyProvider, useSurvey } from '../../src/providers/surveyProvider';
import {
    SingleText,
    SingleSelect,
    Star,
    NPS,
    Numeric,
    MultiSlide,
} from './test-surveys';

const Home = () => {
    const survey = useSurvey();

    const showSurvey = () => {
        survey.showSurvey(MultiSlide);
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
        <SurveyProvider>
            <Home />
        </SurveyProvider>
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
