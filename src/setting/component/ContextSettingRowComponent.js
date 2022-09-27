import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import styled from "styled-components";
import DefaultColors from "../../common/style/DefaultColors";

const ContextSettingRowComponent = ({ iconName, title, value = "empty" }) => (
  <Container>
    <IconContainer>
      <Icon name={iconName} size={24} color={DefaultColors.mainColorToneDown} />
    </IconContainer>
    <TitleContainer>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </TitleContainer>
  </Container>
);

const Container = styled.View`
  width: 100%;
  height: 55px;
  padding: 12px 20px;
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
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-right: 10px;
`;

const Title = styled.Text`
  color: ${DefaultColors.fontColor};
  margin-right: 15px;
  font-size: 16px;
`;

const Value = styled.Text`
  color: ${DefaultColors.gray};
  font-size: 13px;
`;

export default ContextSettingRowComponent;
