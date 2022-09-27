import React, {useEffect, useState} from 'react';
import {withNavigationFocus} from 'react-navigation';
import {Header} from 'react-navigation';
import {View, Alert, Dimensions, Modal, Platform} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/Ionicons';
import {inject, observer} from 'mobx-react';
import {MaterialIndicator, PulseIndicator} from 'react-native-indicators';
import I18n from 'i18n-js';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';

import DefaultColors from '../common/style/DefaultColors';
import CustomQRMarker from '../common/component/CustomQRMarker';

const {width, height} = Dimensions.get('window');

const ScannerPage = ({
  scannerStore,
  dappStore,
  memberInfoFormStore,
  navigation,
  isFocused,
}) => {
  const [requestingConnect, setRequestingConnect] = useState(false);

  useEffect(() => {
    console.log(walletConnectStore.isConnected);
  }, [walletConnectStore, walletConnectStore.isConnected]);

  const onSuccess = async e => {
    try {
      console.log('==== QR 코드 스캔 성공');
      console.log(e.data);

      setRequestingConnect(true);
    } catch (e) {
      Alert.alert(
        I18n.t('asset.qrcode_error'),
        I18n.t('asset.please_try_again'),
      );
      console.log(' === QRCode Scan error: ', e);
    }
  };

  const _renderIndicator = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <PulseIndicator color={'#fff'} size={80} />
      </View>
    );
  };

  const handleSubmitModalButton = () => {
    if (walletConnectStore.isConnected) {
      // walletConnectStore.reset();
      // walletConnectStore.onKillSession();
    }
    setRequestingConnect(false);
    navigation.pop(2);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {isFocused && (
        <QRCodeScanner
          showMarker
          fadeIn={true}
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={5000}
          cameraStyle={{height: height - Header.HEIGHT}}
          cameraProps={{captureAudio: false}}
          customMarker={
            <CustomQRMarker
              width={250}
              height={250}
              borderColor={DefaultColors.mainColorToneUp}
              borderWidth={5}
            />
          }
        />
      )}
      {!scannerStore.isAuthorized && _renderIndicator()}
      <Modal visible={requestingConnect} transparent={true}>
        <ModalContainer>
          <ModalIconContainer>
            {walletConnectStore.isConnected ? (
              <Icon
                name={
                  Platform.OS === 'ios'
                    ? 'ios-checkmark-circle-outline'
                    : 'md-checkmark-circle-outline'
                }
                size={70}
                color={DefaultColors.mainColorToneUp}
              />
            ) : (
              <MaterialIndicator
                size={70}
                color={DefaultColors.mainColorToneUp}
                hidesWhenStopped={true}
              />
            )}
          </ModalIconContainer>
          <ModalInfoContainer>
            {walletConnectStore.isConnected ? (
              <StatusDescText>
                {I18n.t('scanner.complete_connect_desc')}
              </StatusDescText>
            ) : (
              <StatusDescText>{I18n.t('dapp.connecting')}</StatusDescText>
            )}
            <CloseButtonBackground
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[
                DefaultColors.mainColor,
                DefaultColors.mainColorToneDown,
              ]}>
              <CloseButton onPress={handleSubmitModalButton}>
                <CloseText>{I18n.t('dapp.go_back')}</CloseText>
              </CloseButton>
            </CloseButtonBackground>
          </ModalInfoContainer>
        </ModalContainer>
      </Modal>
    </View>
  );
};

const ModalContainer = styled.View`
  position: absolute;
  background-color: white;
  top: ${(height - 250) / 2 - Header.HEIGHT - 2}px;
  left: ${(width - 250) / 2 - 2}px;
  width: 260px;
  height: 260px;
  border-radius: 10px;
  align-items: center;
`;

const ModalIconContainer = styled.View`
  height: 120px;
  padding-top: 40px;
  justify-content: center;
`;

const ModalInfoContainer = styled.View`
  align-items: center;
  justify-content: space-evenly;
  height: 140;
`;

const StatusDescText = styled.Text`
  font-size: 13px;
  color: #6f6f6f;
  text-align: center;
`;

const CloseButtonBackground = styled(LinearGradient)`
  height: 45px;
  width: 150px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.TouchableOpacity`
  height: 45px;
  width: 150px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin: 15px;
`;

const CloseText = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: white;
`;

export default withNavigationFocus(
  inject(
    'scannerStore',
    'dappStore',
    'memberInfoFormStore',
  )(observer(ScannerPage)),
);
