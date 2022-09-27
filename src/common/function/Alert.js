import {Alert} from 'react-native';

export default function(
  title = '타이틀',
  message = '메시지',
  cancelable = false,
  {anotherText, anotherCallback, anotherStyle},
  {cancelText, cancelCallback, cancelStyle},
  {okText, okCallback, okStyle},
) {
  Alert.alert(
    title,
    message,
    [
      anotherText ? {text: anotherText, onPress: anotherCallback} : null,
      cancelText
        ? {text: cancelText, onPress: cancelCallback, style: 'cancel'}
        : null,
      okText
        ? {text: okText, onPress: okCallback}
        : {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable},
  );
}
