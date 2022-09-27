import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import DefaultColors from "../../common/style/DefaultColors";

const TouchableSettingRowComponent = ({ icon, onPress, iconName, title }) => (
  <Container onPress={onPress} disabled={onPress === undefined}>
    <IconContainer>
      {icon ? (
        icon
      ) : (
        <Icon
          name={iconName}
          size={24}
          color={DefaultColors.secondColorToneDown}
        />
      )}
    </IconContainer>
    <TitleContainer>
      <Title>{title}</Title>
    </TitleContainer>
    {onPress !== undefined && (
      <Icon name="chevron-right" size={25} color="#bbb" />
    )}
  </Container>
);

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  width: 100%;
  padding: 12px 20px;
  height: 55px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: white;
`;

const IconContainer = styled.View`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  margin-right: 15px
  border: 1px solid ${DefaultColors.lightGray};
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: ${DefaultColors.fontColor};
  font-size: 16px;
`;

export default TouchableSettingRowComponent;
