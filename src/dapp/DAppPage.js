import React, {useEffect} from 'react';
import {Dimensions, Image, RefreshControl, Text, View} from 'react-native';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'i18n-js';
import Collapsible from 'react-native-collapsible';
import ToggleSwitch from 'toggle-switch-react-native';

import LineSeparator from '../common/component/LineSeparator';
import DefaultColors from '../common/style/DefaultColors';
import images from './image/images';

const {width} = Dimensions.get('window');

const DAppPage = ({
  dappStore,
  assetStore,
  navigation,
}) => {
  const {dappList} = dappStore;
  const dappCollapse = dappStore.dappCollapse.slice();
  const dappListLength = Object.keys(dappList).length;

  useEffect(() => {
  }, [assetStore, dappStore, navigation]);

  const handlePressDappConnect = (connected = false) => {
    if (connected === false) {
      navigation.navigate('ScannerPage');
    } else {
      walletConnectStore.onKillSession();
    }
  };

  return (
    <Container>
      <LoginContainer>
        <BannerContainer>
          <BannerImage source={images.banner} />
          <BannerTitle>{I18n.t('dapp.banner_title')}</BannerTitle>
          <BannerDesc>{I18n.t('dapp.banner_desc')}</BannerDesc>
        </BannerContainer>
        <LoginTextContainer>
          <MediumText>{I18n.t('dapp.connect_desc')}</MediumText>
        </LoginTextContainer>
        <LoginButtonBackground
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}>
          <LoginButton onPress={() => navigation.navigate('ScannerPage')}>
            <Image source={images.qrcode} style={{width: 20, height: 20}} />
            <LoginText>{I18n.t('dapp.connect_now')}</LoginText>
          </LoginButton>
        </LoginButtonBackground>
      </LoginContainer>
      <DAppList
        refreshControl={
          <RefreshControl
            refreshing={dappStore.isRefreshing}
            onRefresh={dappStore.handleRefreshing}
          />
        }>
        <ListTitle>{I18n.t('dapp.all_dapp')}</ListTitle>
        {dappListLength > 0 ? (
          Object.keys(dappList).map((key, index) => {
            const isLastDapp = dappListLength - 1 === index;
            const isCollapsed = dappCollapse[index];
            return (
              <View key={key}>
                <DAppItem last={isLastDapp} collapsed={isCollapsed}>
                  <DAppInfo>
                    <IconImage source={{uri: dappList[key].icons[0]}} />
                    <Text>{dappList[key].name}</Text>
                  </DAppInfo>
                  <View style={{flexDirection: 'row'}}>
                    <SignedStatus
                      connected={dappList[key].isConnected}
                      onPress={() =>
                        handlePressDappConnect(dappList[key].isConnected)
                      }>
                      {dappList[key].isConnected ? (
                        <ConnectToggleImage source={images.on} />
                      ) : (
                        <ConnectToggleImage source={images.off} />
                      )}
                    </SignedStatus>
                    <ToggleDetailButton
                      collapse={isCollapsed}
                      onPress={() => dappStore.toggleDappCollapse(index)}>
                      {isCollapsed ? (
                        <CollapseToggleImage source={images.manIn} />
                      ) : (
                        <CollapseToggleImage source={images.manOut} />
                      )}
                    </ToggleDetailButton>
                  </View>
                </DAppItem>
                <Collapsible collapsed={isCollapsed}>
                  <DetailContainer last={isLastDapp}>
                    <DetailRow>
                      <DetailTitle>{I18n.t('member.email')}</DetailTitle>
                      <ToggleSwitch
                        isOn={true}
                        onColor={DefaultColors.mainColorToneUp}
                        offColor={DefaultColors.gray}
                        size="medium"
                        onToggle={isOn => console.log('changed to : ', isOn)}
                      />
                    </DetailRow>
                    <LineSeparator />
                    <DetailRow>
                      <DetailTitle>{I18n.t('member.mobile')}</DetailTitle>
                      <ToggleSwitch
                        isOn={true}
                        onColor={DefaultColors.mainColorToneUp}
                        offColor={DefaultColors.gray}
                        size="medium"
                        onToggle={isOn => console.log('changed to : ', isOn)}
                      />
                    </DetailRow>
                  </DetailContainer>
                </Collapsible>
              </View>
            );
          })
        ) : (
          <EmptyDAppContainer>
            <EmptyDAppText>{I18n.t('dapp.used_list_empty')}</EmptyDAppText>
          </EmptyDAppContainer>
        )}
        <BottomPadding />
      </DAppList>
    </Container>
  );
};

const Container = styled.View`
	flex: 1;
	background-color: white; // ${DefaultColors.mainColor};
	justify-content: center;
	align-items: center;
`;

const BannerContainer = styled.View`
  height: 100px;
  background-color: black;
`;

const BannerImage = styled.Image`
  resize-mode: cover;
  width: ${width}px;
  height: 100%;
  opacity: 0.5;
`;

const BannerTitle = styled.Text`
  position: absolute;
  color: white;
  top: 25px;
  left: 15px;
  font-weight: bold;
  font-size: 20px;
`;

const BannerDesc = styled.Text`
  position: absolute;
  color: white;
  top: 55px;
  left: 15px;
  font-size: 13px;
`;

const LoginContainer = styled.View`
  width: 100%;
  align-items: center;
  padding-bottom: 17px;
`;

const LoginButtonBackground = styled(LinearGradient)`
  height: 55px;
  width: ${width - 30}px;
  border-radius: 25;
  justify-content: center;
  align-items: center;
`;

const LoginButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  padding: 15px;
  height: 55px;
  width: ${width - 30}px;
  border-radius: 25;
  border-color: rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
`;

const LoginTextContainer = styled.View`
  width: 100%;
  padding-horizontal: 20px;
  padding-vertical: 15px;
`;

const LoginText = styled.Text`
  color: white;
  margin-left: 10px;
  font-size: 16px;
`;

const ListTitle = styled.Text`
  font-size: 15px;
  color: black;
  font-weight: bold;
  margin-top: 12px;
`;

const DAppList = styled.ScrollView`
  width: 100%;
  flex: 1;
  background-color: #f9f9f9;
  padding-horizontal: 15px;
`;

const DAppItem = styled.View`
  margin-top: 12px;
  padding-left: 15px;
  flex-direction: row;
  height: 55px;
  background-color: white;
  justify-content: space-between;
  align-items: center;
`;

const DAppInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SignedStatus = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  width: 55px;
  height: 55px;
  padding-vertical: 5px;
  align-items: center;
  justify-content: center;
  /*background-color: ${DefaultColors.mainColor};*/
  background-color: ${({connected}) =>
    connected ? DefaultColors.mainColor : '#cccccc'};*/
`;

const ConnectToggleImage = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode: contain;
`;

const CollapseToggleImage = styled.Image`
  width: 30px;
  height: 30px;
  resize-mode: contain;
`;

const ToggleDetailButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  background-color: ${({collapse}) =>
    collapse ? '#8C8C8C' : DefaultColors.mainColorToneDown};
  width: 55px;
  height: 55px;
  align-items: center;
  justify-content: center;
`;

const DetailContainer = styled.View`
  border-top-width: 1px;
  border-top-color: ${DefaultColors.lightGray};
  padding-horizontal: 15px;
  padding-vertical: 5px;
  background-color: white;
  ${({last}) => last && 'margin-bottom: 15px;'}
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 10px;
`;

const DetailTitle = styled.Text`
  font-size: 13px;
  color: ${DefaultColors.darkGray};
`;

const IconImage = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const MediumText = styled.Text`
  font-size: 15px;
  color: #555555;
`;

const EmptyDAppContainer = styled.View`
  /*margin: 20px;*/
  flex: 1;
  height: 55px;
  background-color: white;
  border-radius: 5px;
  opacity: 0.6;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const EmptyDAppText = styled.Text`
  font-size: 13px;
  color: #3e4652;
  text-align: center;
`;

const BottomPadding = styled.View`
  height: 15px;
`;

export default inject(
  'dappStore',
  'assetStore'
)(observer(DAppPage));
