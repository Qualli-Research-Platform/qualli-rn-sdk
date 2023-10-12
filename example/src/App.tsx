import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Survey from '../../src/survey/survey';
import {
    SingleText,
    SingleSelect,
    Star,
    NPS,
    Numeric,
    MultiSlide,
} from './test-surveys';

export default function App() {
    const [showSurvey, setShowSurvey] = React.useState(false);

    const handleSurveyComplete = (answers: any) => {
        console.log(answers);
        setShowSurvey(false);
    };

    return (
        <View style={styles.container}>
            <Survey
                survey={MultiSlide}
                isVisible={showSurvey}
                onComplete={handleSurveyComplete}
                onAbortSurvey={() => setShowSurvey(false)}
            />

            <TouchableOpacity onPress={() => setShowSurvey(true)}>
                <Text>{'toggle panel'}</Text>
            </TouchableOpacity>
        </View>
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
