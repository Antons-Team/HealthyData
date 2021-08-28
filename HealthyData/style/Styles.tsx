import {
    StatusBar,
    StyleSheet,
  } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 10,    
        marginTop: 5,
    },
    item: {
        backgroundColor: "whitesmoke",
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 6,
        padding: 5,
        borderColor: "black",
    },
    date: {
        fontWeight: 'bold',
        padding: 15,
    },
    info: {
        padding: 15,
    },
    title: {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        padding: 10,
        paddingBottom: 2,
        fontSize: 18,
    },
    navigationBar: {
        backgroundColor: '#00ffb9',
    },
    headerBar: {
        backgroundColor: '#00ffb9',
    },
    headerTitle: {
        fontWeight: 'bold',
    },
});