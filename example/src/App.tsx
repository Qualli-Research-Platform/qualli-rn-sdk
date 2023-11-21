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
                        plan: 'trial',
                        email: 'john@doe.com',
                        first_name: 'John',
                        last_name: 'Doe',
                    });
                }}
            >
                <Text>{'Update User Attributes'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => qualli.performTrigger('SUBSCRIBE')}
                style={{ marginTop: 20 }}
            >
                <Text>{'trigger SUBSCRIBE'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function App() {
    return (
        <QualliProvider apiKey="120wed885-7f8f-4846-9fa8-3lnqbdfa946">
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
