import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { QualliProvider, useQualli } from '@qualli/qualli-rn-sdk';

const Home = () => {
    const qualli = useQualli();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    qualli.setAttributes({
                        email: 'nick@testing.com',
                        first_name: 'Nick',
                        last_name: 'Smet',
                        testShizzle: 'test',
                    });
                }}
            >
                <Text>{'set some user attributes'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => qualli.performTrigger('SUBSCRIBE')}
                style={{ marginTop: 20 }}
            >
                <Text>{'trigger SUBSCRIBE'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => qualli.performTrigger('MESSAGE')}
                style={{ marginTop: 20 }}
            >
                <Text>{'trigger MESSAGE'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => qualli.performTrigger('LISTENED')}
                style={{ marginTop: 20 }}
            >
                <Text>{'trigger LISTENED'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => qualli.performTrigger('EXITED')}
                style={{ marginTop: 20 }}
            >
                <Text>{'trigger EXITED'}</Text>
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
