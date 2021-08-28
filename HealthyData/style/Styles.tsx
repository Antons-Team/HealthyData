import {
    StatusBar,
    StyleSheet,
} from 'react-native';
import {DARK, LIGHT, RED, BLUE, BLACK, WHITE} from './Colours';


export const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    container: {
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 10,    
        marginTop: 5,
    },
    item: {
        backgroundColor: WHITE,
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 6,
        padding: 5,
        borderColor: LIGHT,
    },
    time: {
        fontFamily: "Roboto-Bold",
        color: DARK,
        padding: 15,
        fontSize: 16,
    },
    info: {
        padding: 15,
        color: DARK,
        fontFamily: "Roboto-Regular",
        fontSize: 16,
    },
    title: {
        fontFamily: "Roboto-Bold",
        alignSelf: 'flex-start',
        padding: 10,
        color: BLACK,
        paddingBottom: 2,
        fontSize: 18,
    },
    navigationBar: {
        backgroundColor: WHITE,
        fontFamily: "Roboto-Regular",
    },
    headerBar: {
        backgroundColor: WHITE,
    },
    headerTitle: {
        fontFamily: "Roboto-Bold",
        fontSize: 24,
        color: DARK,
    },
    splashContainer: {
        backgroundColor: RED,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    splashText: {
        fontSize: 100,
        fontFamily: "Roboto-Bold",
        color: LIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    loginSignupContainer: {
        flex: 1,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    switchLoginSignupContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignSelf: 'center',
        padding: 10,
    },
    switchButton: {
        color: BLUE,
        padding: 2,
        backfaceVisibility: 'hidden',
    },
    loginSignupTextInput: {
        height: 60,
    },
    settingsContainer: {
        padding: 10,
    }
});