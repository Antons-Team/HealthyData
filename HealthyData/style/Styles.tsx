import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {DARK, LIGHT, RED, BLUE, BLACK, WHITE, DARK_GRAY} from './Colours';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_COVER = 160;
export const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto-Regular',
    color: DARK_GRAY,
  },
  textBold: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
  },
  buttonWhiteText: {
    color: WHITE,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textAlignCenter: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  circleTextHighlight: {
    color: WHITE,
    paddingHorizontal: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 30,
    borderRadius: 15,
  },

  modalConainer: {
    height: SCREEN_HEIGHT - MODAL_COVER,
    backgroundColor: WHITE,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  formContainer: {
    flexDirection: 'column',
    height: SCREEN_HEIGHT - MODAL_COVER - 100,
    justifyContent: 'space-between',
  },
  tabBarStyle: {
    elevation: 0,
    marginHorizontal: 10,
  },
  tabBarIndicatorStyle: {
    backgroundColor: BLUE,
    height: 40,
    marginBottom: 5,
    borderRadius: 20,
  },
  tabBarLabelStyle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  },
  halfButton: {
    width: SCREEN_WIDTH / 2 - 20,
    height: 35,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  blueButton: {
    backgroundColor: BLUE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textInputBlue: {
    borderColor: BLUE,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 3,
    color: BLUE,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },

  tileContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 5,
    borderColor: '#bbb',
  },
  tileHeading: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5,
    color: DARK_GRAY,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  addContainer: {
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
    marginTop: 10,
    borderColor: LIGHT,
  },
  time: {
    fontFamily: 'Roboto-Bold',
    color: DARK,
    padding: 15,
    fontSize: 16,
  },
  info: {
    padding: 15,
    color: DARK,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    alignSelf: 'flex-start',
    padding: 10,
    color: BLACK,
    paddingBottom: 2,
    fontSize: 18,
  },
  navigationBar: {
    backgroundColor: WHITE,
    fontFamily: 'Roboto-Regular',
  },
  headerBar: {
    backgroundColor: WHITE,
  },
  headerTitle: {
    fontFamily: 'Roboto-Bold',
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
    fontFamily: 'Roboto-Bold',
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
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
  },
  medicationItem: {
    backgroundColor: WHITE,
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
    display: 'flex',
    borderColor: LIGHT,
  },
  dropDown: {
    backgroundColor: WHITE,
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
    display: 'flex',
    alignSelf: 'center',
    borderColor: LIGHT,
  },
  medicationText: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flexGrow: 1,
    display: 'flex',
  },
  medicationAdd: {
    alignSelf: 'flex-end',
  },
  medicationTop: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    padding: 2,
    flex: 1,
    color: DARK,
  },
  medicationBottom: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    padding: 2,
    flex: 2,
    color: DARK,
  },
  searchBar: {
    borderRadius: 30,
    borderWidth: 1.5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 5,
    fontFamily: 'Roboto-Regular',
    borderColor: 'black',
    backgroundColor: WHITE,
  },
  infoContainer: {
    backgroundColor: RED,
    flexDirection: 'column',
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'flex-start',
  },
  infoHeader: {
    flexDirection: 'column',
    paddingTop: 20,
    height: 80,
  },
  infoHeaderText: {
    fontSize: 45,
    width: SCREEN_WIDTH,
    height: 60,
    flex: 1,
    color: WHITE,
    fontFamily: 'Roboto-Regular',
    // fontWeight: "bold",
    textAlign: 'center',
    // letterSpacing: 2
  },
  infoHeaderSubtitle: {
    fontSize: 15,
    flex: 1,
    color: LIGHT,
    fontFamily: 'Roboto-Regular',
  },
  infoTitle: {
    // textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    color: DARK_GRAY,
    fontSize: 24,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  infoParagraph: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: WHITE,
  },
  infoButton: {
    alignSelf: 'center',
    // flex: 1,
    padding: 10,
    position: 'absolute',
    bottom: 0,
  },
  settingsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  settingsNavigator: {
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 6,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    //borderBottomColor: DARK,
    borderBottomColor: '#ddd',
  },
  settingsArrow: {
    alignSelf: 'flex-end',
  },
  settingsText: {
    fontFamily: 'Roboto-Regular',
    flex: 1,
    color: DARK,
    fontSize: 20,
    alignSelf: 'flex-start',
  },
  profileDetailsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  profileDetailsTitle: {
    fontFamily: 'Roboto-Medium',
    color: DARK,
    fontSize: 9,
    paddingLeft: 18,
    paddingTop: 10,
    backgroundColor: WHITE,
  },
  profileDetailsEntry: {
    height: 40,
    marginBottom: 10,
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    color: DARK,
    backgroundColor: WHITE,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingLeft: 18,
  },
  addMedicationContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  addMedicationEntry: {
    height: 60,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    color: DARK,
    backgroundColor: WHITE,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingLeft: 18,
  },
  addMedicationEntryPadded: {
    height: 60,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 55,
    borderRadius: 6,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    color: DARK,
    backgroundColor: WHITE,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingLeft: 18,
  },
  addMedicationTimeText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: DARK,
    backgroundColor: WHITE,
  },
  addMedicationTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    padding: 10,
  },
  questionContainer: {
    paddingVertical: 20,
    borderRadius: 30,
    borderColor: '#eee',
    borderWidth: 2,
    marginVertical: 5,
  },

  radioButtonsContainer: {
    //flex: 1,
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  radioButtonDay: {
    borderRadius: 50,
    flex: 0,
    height: 40,
    marginLeft: 3,
    marginRight: 3,
    width: 40,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: DARK,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonSelectedColor: {
    backgroundColor: BLUE,
  },
  buttonUnselectedColor: {
    backgroundColor: WHITE,
  },
  toggleIntervalButton: {
    flex: 0,
    height: 40,
    borderRadius: 10,
    width: (SCREEN_WIDTH - 40) / 2,
    marginLeft: 5,
    marginRight: 5,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: DARK,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  intervalTextEntry: {
    width: 60,
    height: 50,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    color: DARK,
    backgroundColor: WHITE,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});
