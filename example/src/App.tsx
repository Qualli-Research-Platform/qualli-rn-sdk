import * as React from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import { QualliProvider, useQualli } from '@qualli/qualli-rn-sdk';

const Home = () => {
    const qualli = useQualli();

    return (
        <View style={styles.container}>
            <Image
                source={require('./../assets/bg-1.png')}
                style={styles.bg}
                resizeMethod="scale"
                resizeMode="cover"
            />

            <TouchableWithoutFeedback
                onPress={() => qualli.performTrigger('SUBSCRIBE')}
            >
                <View style={{ width: 400, height: 400 }}></View>
            </TouchableWithoutFeedback>
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
});
