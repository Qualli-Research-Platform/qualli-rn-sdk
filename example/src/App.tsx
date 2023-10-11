import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Survey from '../../src/survey/survey';
import { SingleText, SingleSelect, Star, NPS, Numeric } from './test-surveys';

export default function App() {
    const [forceOpenInt, setForceOpenInt] = React.useState(0);

    return (
        <View style={styles.container}>
            <Survey survey={Numeric} forceOpenInt={forceOpenInt} />

            <TouchableOpacity onPress={() => setForceOpenInt(forceOpenInt + 1)}>
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
