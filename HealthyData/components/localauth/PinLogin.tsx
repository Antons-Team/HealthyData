import React, {ReactElement} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BLUE, DARK } from '../../style/Colours';
import {styles} from '../../style/Styles';

type KeyProps = {
  value: string;
  handleKeyPress: () => void;
};

// TODO: fix style for some of these

const EMPTY = '';
const DELETE = 'D';
export const MAX_PIN_LENGTH = 4;

const Key = ({value, handleKeyPress}: KeyProps) => {
  switch (value) {
    case EMPTY:
      return <Text> </Text>;
    case DELETE:
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleKeyPress}>
          <Ionicons 
          size={40}
          color={DARK}
          name={'backspace'} />
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity
          onPress={handleKeyPress}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text 
          style={{fontSize: 35, color: DARK}}
          >{value}</Text>
        </TouchableOpacity>
      );
  }
};

type NumPadProps = {
  handleKeyPress: (key: string) => void;
  handleDelete: () => void;
};

const NumPad = ({handleKeyPress, handleDelete}: NumPadProps) => {
  const values = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    EMPTY,
    '0',
    DELETE,
  ];

  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, alignSelf:"center"}}>
      {values.map(value => {
        return (
          <View
            key={value}
            style={{
              width:
                (Dimensions.get('window').width -
                  (styles.loginSignupContainer.padding) * 2) /
                3,
              height: Dimensions.get('window').height / 12,
            }}>
            <Key
              value={value}
              handleKeyPress={
                value !== DELETE ? () => handleKeyPress(value) : handleDelete
              }
            />
          </View>
        );
      })}
    </View>
  );
};

type PinFieldProps = {
  pin: string;
  hidden: boolean;
};
const PinField = ({pin, hidden}: PinFieldProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 50,
      }}>
      {pin.split('').map((digit, i) => {
        return <PinNumber key={i} displayChar={hidden ? '*' : digit} />;
      })}
      {new Array(MAX_PIN_LENGTH - pin.length).fill(' ').map((_, i) => (
        <PinNumber key={i} displayChar=" " />
      ))}
    </View>
  );
};

type PinNumberProps = {displayChar: string};
const PinNumber = ({displayChar}: PinNumberProps) => {
  return (
    <View
      style={{
        borderColor:BLUE,
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 20,
        ...styles.center,
      }}>
      <Text style={[styles.textBold, {color: BLUE, fontSize: 40}]}>{displayChar}</Text>
    </View>
  );
};

type PinLoginProps = {
  pin: string;
  setPin: (_pin: string) => void;
  loading: boolean;
  message: string;
};
const PinLogin = ({
  pin,
  setPin,
  loading,
  message,
}: PinLoginProps): ReactElement => {
  const handleKeyPress = (value: string) => {
    if (pin.length < MAX_PIN_LENGTH) {
      setPin(pin + value);
    }
  };

  const handleDelete = () => {
    if (!loading) {
      setPin(pin.substring(0, pin.length - 1));
    }
  };

  return (
    <View style={{flex: 1}}>
      <Text style={{...styles.info, alignSelf: 'center'}}>{message}</Text>
      <PinField pin={pin} hidden={true} />
      <NumPad handleKeyPress={handleKeyPress} handleDelete={handleDelete} />
    </View>
  );
};

export default PinLogin;
