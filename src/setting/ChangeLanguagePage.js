import React, { useState } from "react";
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  Image,
  AsyncStorage,
} from "react-native";
import styled from "styled-components";
import I18n from "../config/i18n";
import i18n from "i18n-js";
import Icon from "react-native-vector-icons/Feather";
import { inject, observer } from "mobx-react";
import images from "./image/images";
import DefaultColors from "../common/style/DefaultColors";
import RemoveHeaderShadow from "../common/style/RemoveHeaderShadow";

const SelectedLang = () => {
  return (
    <View>
      <Icon name={"check"} size={25} color={DefaultColors.mainColor} />
    </View>
  );
};

const ChangeLanguagePage = ({ memberStore, navigation }) => {
  const [currentLang, setCurrentLang] = useState(I18n.currentLocale() || "en");

  const handleSetLocale = async (lang) => {
    i18n.locale = lang;
    I18n.locale = lang;
    setCurrentLang(lang);
    await AsyncStorage.setItem("locale", lang);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <NavTitle>{i18n.t("gp.change_language")}</NavTitle>
        <LanguageRow onPress={() => handleSetLocale("en")}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.enFlag} style={{ width: 20, height: 15 }} />
            </IconContainer>
            <LanguageText isSelected={currentLang === "en"}>
              ENGLISH
            </LanguageText>
          </LanguageTitle>
          {currentLang === "en" && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale("ko")}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.koFlag} style={{ width: 20, height: 15 }} />
            </IconContainer>
            <LanguageText isSelected={currentLang === "ko"}>
              한국어
            </LanguageText>
          </LanguageTitle>
          {currentLang === "ko" && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale("zh")}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.zhFlag} style={{ width: 20, height: 15 }} />
            </IconContainer>
            <LanguageText isSelected={currentLang === "zh"}>
              中國語
            </LanguageText>
          </LanguageTitle>
          {currentLang === "zh" && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale("jp")}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.jpFlag} style={{ width: 20, height: 15 }} />
            </IconContainer>
            <LanguageText isSelected={currentLang === "jp"}>
              日本語
            </LanguageText>
          </LanguageTitle>
          {currentLang === "jp" && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale("th")}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.thFlag} style={{ width: 20, height: 15 }} />
            </IconContainer>
            <LanguageText isSelected={currentLang === "th"}>
              ภาษาไทย
            </LanguageText>
          </LanguageTitle>
          {currentLang === "th" && <SelectedLang />}
        </LanguageRow>
      </Container>
    </TouchableWithoutFeedback>
  );
};

ChangeLanguagePage.navigationOptions = ({ screenProps }) => {
  return {
    title: "", // screenProps.i18Nav.t('gp.change_language'),
    headerStyle: RemoveHeaderShadow,
  };
};

const Container = styled.View`
  flex: 1;
`;

const NavTitle = styled.Text`
  padding: 5px 20px 20px 20px;
  font-size: 17px;
  font-weight: bold;
`;

const LanguageRow = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  height: 55px;
  align-items: center;
  flex-direction: row;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
`;

const LanguageTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LanguageText = styled.Text`
  color: ${({ isSelected }) =>
    isSelected ? DefaultColors.mainColorToneDown : DefaultColors.darkGray};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
`;

const IconContainer = styled.View`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  margin-right: 15px
  border: 1px solid #e5e5e5;
  align-items: center;
  justify-content: center;
`;

export default inject("memberStore")(observer(ChangeLanguagePage));
