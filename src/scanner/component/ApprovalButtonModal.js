import React from 'react';
import {Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import DefaultColors from '../../common/style/DefaultColors';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../config/i18n';

const {width} = Dimensions.get('window');

const ApprovalButtonModal = ({
  isVisible,
  toggleModal,
  requestComplete,
  message,
  handlePressApprove,
}) => (
  <Modal
    isVisible={isVisible}
    hasBackdrop={false}
    backdropOpacity={0.4}
    swipeDirection={['down']}
    onSwipeComplete={toggleModal}
    style={{justifyContent: 'flex-end', marginBottom: -20}}>
    <ModalContainer>
      <ModalContent>
        <InfoMessage>{message}</InfoMessage>
        {!requestComplete && (
          <ButtonContainer>
            <CancelButton onPress={toggleModal}>
              <CancelText>{I18n.t('cancel')}</CancelText>
            </CancelButton>
            <ApproveGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[
                DefaultColors.mainColor,
                DefaultColors.mainColorToneDown,
              ]}>
              <ApproveButton onPress={handlePressApprove}>
                <ApproveText>{I18n.t('approval')}</ApproveText>
              </ApproveButton>
            </ApproveGradient>
          </ButtonContainer>
        )}
      </ModalContent>
    </ModalContainer>
  </Modal>
);

const ModalContainer = styled.View`
  background-color: white;
  padding: 10px;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  border-radius: 25px;
  height: 200px;
  elevation: 9;
`;

const ModalContent = styled.View`
  height: 200px;
  background-color: white;
  border-radius: 25px;
  padding: 15px;
  width: ${width}px;
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
  width: 42%;
  border-radius: 25px;
  align-items: center;
`;

const ApproveButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 13px;
  width: 42%;
  border-radius: 25px;
`;

const ApproveText = styled.Text`
  font-size: 17px;
  text-align: center;
  font-weight: bold;
  color: white;
`;

const CancelButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 13px;
  background-color: white;
  border: 1px solid #808080;
  width: 42%;
  margin-right: 15px;
  border-radius: 25px;
`;

const CancelText = styled.Text`
  font-size: 17px;
  color: black; //#7993bf;
  text-align: center;
  font-weight: bold;
`;

export default ApprovalButtonModal;
