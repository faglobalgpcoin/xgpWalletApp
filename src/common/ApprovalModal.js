import React from 'react';
import {Dimensions, Modal} from 'react-native';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
// import I18n from '../config/i18n';
import I18n from 'i18n-js';
import DefaultColors from './style/DefaultColors';
import {inject, observer} from 'mobx-react';

const {width} = Dimensions.get('window');

const ApprovalModal = ({walletConnectStore, navigation}) => (
  <ModalContainer visible={true} animationType="slide" transparent={true}>
    <ModalContent>
      <InfoMessage>{walletConnectStore.requestMessage}</InfoMessage>
      {!walletConnectStore.isModalCompleteRequest && (
        <ButtonContainer>
          <CancelButton
            onPress={() =>
              walletConnectStore.handleModalCancelEvent(navigation)
            }>
            <CancelText>{I18n.t('cancel')}</CancelText>
          </CancelButton>
          <ApproveGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}>
            <ApproveButton
              onPress={() =>
                walletConnectStore.handleModalApproveEvent(navigation)
              }>
              <ApproveText>{I18n.t('approval')}</ApproveText>
            </ApproveButton>
          </ApproveGradient>
        </ButtonContainer>
      )}
    </ModalContent>
  </ModalContainer>
);

const ModalContainer = styled(Modal)`
  flex: 1;
`;

const ModalContent = styled.View`
  position: absolute;
  bottom: 0px;
  height: 200px;
  margin-bottom: -20px;
  background-color: white;
  border-radius: 25px;
  padding: 15px;
  width: ${width}px;
  elevation: 10;
`;

const InfoMessage = styled.Text`
  margin-vertical: 15px;
  text-align: center;
  color: ${DefaultColors.darkGray};
  font-weight: bold;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const ApproveGradient = styled(LinearGradient)`
  width: 43%;
  border-radius: 25px;
  align-items: center;
`;

const ApproveButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  padding-vertical: 13px;
  width: 45%;
  border-radius: 25px;
`;

const ApproveText = styled.Text`
  font-size: 15px;
  text-align: center;
  font-weight: bold;
  color: white;
`;

const CancelButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  padding-vertical: 13px;
  background-color: white;
  border: 1px solid ${DefaultColors.mainColorToneDown};
  width: 45%;
  margin-right: 15px;
  border-radius: 25px;
`;

const CancelText = styled.Text`
  font-size: 15px;
  color: ${DefaultColors.mainColorToneDown};
  text-align: center;
  font-weight: bold;
`;

export default inject('walletConnectStore')(observer(ApprovalModal));
