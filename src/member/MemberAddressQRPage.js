import React from 'react';
import {
  Clipboard,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import DefaultColors from '../common/style/DefaultColors';
import styled from 'styled-components';
// import I18n from '../config/i18n';
import I18n from 'i18n-js';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

@inject('assetReceiveStore')
@observer
class MemberAddressQRPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('member.my_did_address'),
      headerTitleStyle: {fontWeight: '200'},
      headerStyle: {backgroundColor: DefaultColors.mainColorToneDown},
      headerTransparent: true,
    };
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
    this.props.assetReceiveStore.setInitialStore(
      this.props.navigation.state.params,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.assetReceiveStore.reset();
  }

  writeToClipboard = () => {
    Clipboard.setString(this.props.navigation.state.params.address);
    Toast.show(
      I18n.t('asset.address_copy_complete', {
        name: I18n.t('address'),
      }),
    );
  };

  keyboardDidShow = () => {
    this.props.assetReceiveStore.setIsKeyboardShowTrue();
  };

  keyboardDidHide = () => {
    this.props.assetReceiveStore.setIsKeyboardShowFalse();
  };

  render() {
    const props = this.props.navigation.state.params;
    const store = this.props.assetReceiveStore;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}>
          <ModalContainer>
            <AddressContainer
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#4B58A1', DefaultColors.mainColorToneUp]}>
              <AddressButton onPressOut={this.writeToClipboard}>
                <Address>{props.address}</Address>
                <Icon size={15} name="content-copy" color="#CECECE" />
              </AddressButton>
            </AddressContainer>
            <ContentContainer>
              {Platform.OS === 'android' && store.isKeyboardShow ? null : (
                <QRCodeContainer>
                  <QRCode
                    size={180}
                    value={props.address}
                    color="black"
                    backgroundColor="white"
                  />
                </QRCodeContainer>
              )}
            </ContentContainer>
          </ModalContainer>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const Container = styled(LinearGradient)`
  flex: 1;
  background: ${DefaultColors.mainColorToneDown};
`;

const ModalContainer = styled.View`
  flex: 1;
  margin-top: ${height * 0.14}px;
  margin-bottom: ${height * 0.14 - 20}px;
  margin-horizontal: 20px;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
`;

const AddressContainer = styled(LinearGradient)`
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: ${DefaultColors.mainColorToneUp};
`;

const AddressButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Address = styled.Text`
  width: 90%;
  padding-left: 10;
  padding-right: 7;
  font-size: 11;
  color: #fff;
`;

const ContentContainer = styled.View`
  justify-content: space-evenly;
  flex: 1;
`;

const QRCodeContainer = styled.View`
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export default MemberAddressQRPage;
