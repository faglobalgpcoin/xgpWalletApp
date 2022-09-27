import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components";
import LinearGradient from "react-native-linear-gradient";
import DefaultColors from "../common/style/DefaultColors";
import { PrivacyPolicy, TermsOfUse } from "./Policy";
import { PrivacyPolicyEnglish, TermsOfUseEnglish } from "./PolicyEnglish";
// import I18n from '../config/i18n';
import I18n from "i18n-js";
import LineSeparator from "../common/component/LineSeparator";

const PolicyPage = () => {
  return (
    <Background
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FakeModal>
          <Title>{I18n.t("setting.privacy_policy")}</Title>
          <Content>{PrivacyPolicyEnglish}</Content>
          <LineSeparator />
          <Title>{I18n.t("setting.terms_of_use")}</Title>
          <Content>{TermsOfUseEnglish}</Content>
        </FakeModal>
      </SafeAreaView>
    </Background>
  );
};

const Background = styled(LinearGradient)`
  flex: 1;
  padding-top: 25px;
`;

const FakeModal = styled.ScrollView`
  background-color: white;
  margin: 50px 30px;
  border-radius: 10px;
  padding: 15px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: #3a3a45;
`;

const Content = styled.Text`
  color: #696969;
  font-size: 14px;
  line-height: 18;
`;

export default PolicyPage;
