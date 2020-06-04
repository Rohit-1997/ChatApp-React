import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import SearchHeader from 'react-native-search-header';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';


export default function PeopleSearchTabScreen() {
    const searchHeaderRef = React.useRef(null);

    return (
        <View style={styles.bckclr}>
            <StatusBar barStyle='light-content' />
            <View style={styles.header}>
                <Icon
                    style={{ paddingLeft: 15 }}
                    name='search'
                    size={35}
                    color='#FFFFFF'
                    onPress={() => searchHeaderRef.current.show()}
                />
            </View>
            <SearchHeader
                ref={searchHeaderRef}
                placeholder='Search...'
                placeholderColor='gray'
            />
        </View>
    );
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    bckclr: {
        flex: 1,
        // backgroundColor: '#fcfbee'
    },
    tabs: {
        backgroundColor: '#9477cb',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    status: {
        zIndex: 10,
        elevation: 2,
        height: 21,
        backgroundColor: '#0097a7'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: window.width - 48,
        height: 56,
        marginBottom: 6,
        backgroundColor: '#9477cb'
    },
    label: {
        flexGrow: 1,
        fontSize: 20,
        fontWeight: `600`,
        textAlign: `left`,
        marginVertical: 8,
        paddingVertical: 3,
        color: `#f5fcff`,
        backgroundColor: `transparent`
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 40,
        marginTop: 40,
        borderRadius: 2,
        backgroundColor: `#ff5722`
    }
});
