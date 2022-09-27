import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from 'i18n-js';

import DefaultColors from '../common/style/DefaultColors';
import images from './image/images';

const {width} = Dimensions.get('window');

const MemberPage = ({navigation, memberInfoFormStore}) => {
  const sDID = `did:klaytn:null ...`;
  const userInfo = memberInfoFormStore.userInfo;

  const handlePressInfoChange = () => {
    navigation.navigate('MemberInfoFormPage');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `did:klaytn:null`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <AvatarBackground
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}
        />
        <AvatarContainer>
          <Avatar source={images.myAvatar} />
          <Text style={{fontSize: 19, color: 'white'}}>
            {I18n.t('member.member_welcome', {name: userInfo.name})}
          </Text>
        </AvatarContainer>
        <MyButtonContainer>
          <MyButton onPress={handlePressInfoChange}>
            <Icon name={'pencil'} color={DefaultColors.darkGray} size={35} />
          </MyButton>
          <MyButtonDivider />
          <MyButton
            onPress={() =>
              navigation.navigate({
                routeName: 'MemberAddressQRPage',
                params: {
                  address: `did:klaytn:null`,
                },
              })
            }>
            <MIcon name="qrcode-scan" size={25} color={'#585858'} />
          </MyButton>
          <MyButtonDivider />
          <MyButton onPress={onShare}>
            <Icon
              name={'share-google'}
              color={DefaultColors.darkGray}
              size={35}
            />
          </MyButton>
        </MyButtonContainer>
        <InfoBackground>
          <TitleContainer>
            <Title>{I18n.t('member.my_info')}</Title>
          </TitleContainer>
          <InfoContainer>
            <InfoRow>
              <InfoTitle>sDID</InfoTitle>
              <InfoInput>{sDID}</InfoInput>
            </InfoRow>
            <InfoRow>
              <InfoTitle>{I18n.t('member.name')}</InfoTitle>
              <InfoInput>{userInfo.name}</InfoInput>
            </InfoRow>
            <InfoRow>
              <InfoTitle>{I18n.t('member.gender')}</InfoTitle>
              <InfoInput>{userInfo.gender}</InfoInput>
            </InfoRow>
            <InfoRow>
              <InfoTitle>{I18n.t('member.birthdate')}</InfoTitle>
              <InfoInput>{userInfo.birthdate}</InfoInput>
            </InfoRow>
            <InfoRow>
              <InfoTitle>{I18n.t('member.residence_country')}</InfoTitle>
              <InfoInput>{userInfo.country}</InfoInput>
            </InfoRow>
          </InfoContainer>
          <TitleContainer>
            <Title>{I18n.t('member.crtfd_info')}</Title>
          </TitleContainer>
          <InfoContainer>
            <InfoRow>
              <InfoTitle>{I18n.t('member.email')}</InfoTitle>
              <CrtfdRow>
                <InfoInput>{userInfo.email}</InfoInput>
                <FlexRow>
                  <CrtfdImage source={images.crtfd} />
                  {/*<CrtfdStatus crtfd={userInfo.emailCrtfd}>*/}
                  {/*  <CrtfdText crtfd={userInfo.emailCrtfd}>*/}
                  {/*    {userInfo.emailCrtfd*/}
                  {/*      ? I18n.t('member.crtfd_complete')*/}
                  {/*      : I18n.t('member.not_crtfd')}*/}
                  {/*  </CrtfdText>*/}
                  {/*</CrtfdStatus>*/}
                  <DappButtonDivider />
                  <DappListButton>
                    <Icon
                      name={'arrow-right'}
                      color={DefaultColors.darkGray}
                      size={35}
                    />
                  </DappListButton>
                </FlexRow>
              </CrtfdRow>
            </InfoRow>
            <InfoRow>
              <InfoTitle>{I18n.t('member.mobilePhone')}</InfoTitle>
              <CrtfdRow>
                <InfoInput>{userInfo.mobilePhone}</InfoInput>
                <FlexRow>
                  <CrtfdImage source={images.crtfd} />
                  {/*{userInfo.mobileCrtfd*/}
                  {/*  ? I18n.t('member.crtfd_complete')*/}
                  {/*  : I18n.t('member.not_crtfd')}*/}
                  {/*<CrtfdStatus crtfd={userInfo.mobileCrtfd}>*/}
                  {/*  <CrtfdText crtfd={userInfo.mobileCrtfd}>*/}
                  {/*  </CrtfdText>*/}
                  {/*</CrtfdStatus>*/}
                  <DappButtonDivider />
                  <DappListButton>
                    <Icon
                      name={'arrow-right'}
                      color={DefaultColors.darkGray}
                      size={35}
                    />
                  </DappListButton>
                </FlexRow>
              </CrtfdRow>
            </InfoRow>
          </InfoContainer>
        </InfoBackground>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ebebeb;
`;

const AvatarContainer = styled.View`
  padding: 10px;
  padding-top: ${ifIphoneX('50', '10')}px;
  align-items: center;
  justify-content: center;
  height: ${ifIphoneX('250', '200')}px;
`;

const AvatarBackground = styled(LinearGradient)`
  position: absolute;
  width: ${width + 30}px;
  background-color: ${DefaultColors.mainColor};
  height: ${ifIphoneX('250', '200')}px;
`;

const Avatar = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 65px;
  margin-bottom: 13px;
  border-width: 2px;
  border-color: ${DefaultColors.lightGray};
`;

const MyButtonContainer = styled.View`
  height: 70px;
  flex-direction: row;
  padding-horizontal: 15px;
  background-color: white;
`;

const MyButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.5,
})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const MyButtonDivider = styled.View`
  width: 1px;
  border: 0.5px solid #d6d6d6;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DappButtonDivider = styled.View`
  width: 1px;
  height: 25px;
  border: 0.5px solid #d6d6d6;
  margin-left: 13px;
  margin-right: 7px;
`;

const InfoBackground = styled.View`
  flex: 1;
  background-color: #ebebeb;
  padding-bottom: 15px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  padding-top: 13px;
  padding-bottom: 8px;
  padding-horizontal: 18px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 15px;
  color: black;
  font-weight: bold;
`;

const InfoContainer = styled.View`
  background-color: white;
  margin-horizontal: 15px;
  padding-vertical: 8px;
`;

const InfoRow = styled.View`
  flex: 1;
  padding-horizontal: 7px;
  border-bottom-width: 1px;
  border-bottom-color: ${DefaultColors.lightGray};
  margin-horizontal: 10px;
  margin-vertical: 7px;
`;

const InfoTitle = styled.Text`
  color: #a1a1a1;
  font-size: 13px;
`;

const InfoInput = styled.Text`
  padding-vertical: 5px;
  flex: 1;
`;

const DappListButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})``;

const CrtfdImage = styled.Image`
  width: 23px;
  height: 23px;
`;

const CrtfdStatus = styled.View`
  height: 27px;
  padding-vertical: 5px;
  padding-horizontal: 5px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  background-color: ${({crtfd}) => (crtfd ? DefaultColors.gray : 'white')};
  border: 1px solid ${({crtfd}) => (crtfd ? 'white' : '#656565')};
`;

const CrtfdText = styled.Text`
  font-size: 11px;
  color: ${({crtfd}) => (crtfd ? 'white' : '#656565')};
`;

const CrtfdRow = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const FlexRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-left: 10px;
  padding-bottom: 10px;
`;

export default inject('memberInfoFormStore')(
  observer(MemberPage),
);
