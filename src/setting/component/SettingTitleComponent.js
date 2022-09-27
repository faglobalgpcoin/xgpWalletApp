import React from "react";
import styled from "styled-components";

const SettingCategoryComponent = ({ title, height = "40" }) => (
  <SettingCategoryContainer height={height}>
    <SettingCategoryText>{title}</SettingCategoryText>
  </SettingCategoryContainer>
);

const SettingCategoryContainer = styled.View`
  height: ${({ height }) => height}px;
  justify-content: flex-end;
  width: 100%;
  padding-horizontal: 20px;
  padding-bottom: 8px;
`;

const SettingCategoryText = styled.Text`
  font-size: 16px;
  color: #898989;
`;

export default SettingCategoryComponent;
