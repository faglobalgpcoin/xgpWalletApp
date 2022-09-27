import React, {useEffect} from 'react';
import {Platform, Dimensions} from 'react-native';
import {HeaderBackButton} from 'react-navigation';
import {inject, observer} from 'mobx-react';
import {DotIndicator} from 'react-native-indicators';
import styled from 'styled-components';
import DefaultColors from '../common/style/DefaultColors';
import LinearGradient from 'react-native-linear-gradient';
// import I18n from '../config/i18n';
import I18n from 'i18n-js';

const {height} = Dimensions.get('window');

const ConnectingPage = ({
  walletConnectStore,
  memberInfoFormStore,
  dappStore,
}) => {
  useEffect(() => {
    return () => {
      walletConnectStore.handleComponentWillUnmount();
    };
  }, [dappStore, walletConnectStore]);

  const renderIndicator = () => {
    return (
      <IndicatorContainer>
        <DotIndicator color={DefaultColors.mainColor} size={15} />
      </IndicatorContainer>
    );
  };

  const renderConnectInfo = () => {
    const store = walletConnectStore;
    return (
      <InfoContainer>
        <HeaderContainer>
          <InfoCheck>
            {store.isConnected
              ? I18n.t('scanner.connect_complete')
              : I18n.t('scanner.check_connect_info')}
          </InfoCheck>
          <ConnectInfoContainer>
            <InfoTitle>{store.sessionPeerMeta.name}</InfoTitle>
            <InfoDesc>{store.sessionPeerMeta.url}</InfoDesc>
          </ConnectInfoContainer>
        </HeaderContainer>
        <InfoButtonContainer>
          {store.isConnected && store.isDappRequestUserApprove && (
            <InfoApproveGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[
                DefaultColors.mainColor,
                DefaultColors.mainColorToneDown,
              ]}>
              <InfoApproveButton
                onPress={() =>
                  store.handleApproveProvidingUserInfo(memberInfoFormStore)
                }>
                <ApproveText>{I18n.t('scanner.privacy_approval')}</ApproveText>
              </InfoApproveButton>
            </InfoApproveGradient>
          )}
        </InfoButtonContainer>
      </InfoContainer>
    );
  };

  return (
    <Container>
      {walletConnectStore.representationIcon !== '' && (
        <RprImage source={{uri: walletConnectStore.representationIcon}} />
      )}
      {walletConnectStore.isVerifiedUser
        ? renderConnectInfo()
        : renderIndicator()}
    </Container>
  );
};

ConnectingPage.navigationOptions = ({navigation}) => ({
  headerLeft: (
    <HeaderBackButton
      onPress={() => {
        navigation.pop(2);
      }}
    />
  ),
});

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  padding-top: 80px;
`;

const RprImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  margin-bottom: ${Platform.OS === 'ios' ? 0 : 30}px;
  margin-top: ${Platform.OS === 'ios' ? height * 0.1 : 0}px;
`;

const InfoContainer = styled.View`
  flex: 1;
  padding-top: ${Platform.OS === 'ios' ? height * 0.1 : 0}px;
  padding-bottom: 25px;
  justify-content: space-between;
`;

const HeaderContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const InfoCheck = styled.Text`
  font-size: 22px;
  color: black;
  font-weight: bold;
`;

const ConnectInfoContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.Text`
  color: #444444;
  text-align: left;
  font-size: 17px;
  margin-bottom: 15px;
`;

const InfoDesc = styled.Text`
  color: #444444;
  font-size: 15px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: 20px;
`;

const ApproveButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 13px;
  background-color: ${DefaultColors.mainColor};
  width: 42%;
  margin-left: 15px;
  border-radius: 25px;
`;

const ApproveText = styled.Text`
  font-size: 17px;
  text-align: center;
  font-weight: bold;
  color: white;
`;

const InfoButtonContainer = styled(ButtonContainer)`
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InfoApproveGradient = styled(LinearGradient)`
  width: 250px;
  border-radius: 25px;
`;

const InfoApproveButton = styled(ApproveButton)`
  width: 100%;
  margin-left: 0px;
`;

const IndicatorContainer = styled.View`
  flex: 1;
  padding-bottom: 50;
`;

export default inject('walletConnectStore', 'memberInfoFormStore', 'dappStore')(
  observer(ConnectingPage),
);
