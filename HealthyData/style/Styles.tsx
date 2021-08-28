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
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: "whitesmoke",
        borderWidth: 2,
        borderRadius: 6,
        padding: 5,
        borderColor: "black",
    },
    date: {
        fontWeight: 'bold',
    },
    title: {

    },
    navigationBar: {
        backgroundColor: '#00ffb9',
    }
});