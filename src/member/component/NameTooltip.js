import {Text, View} from 'react-native';
import I18n from '../../config/i18n';
import React from 'react';
import styled from 'styled-components';

export const NameTooltip = () => (
  <View>
    <TooltipRow>
      {/*<TooltipBullet>️</TooltipBullet>*/}
      <Text>{I18n.t('member.name_tooltip')}</Text>
    </TooltipRow>
  </View>
);

const PaddingRightView = styled.View`
  padding-right: 15px;
`;

const TooltipRow = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const TooltipBullet = styled.Text`
  margin-right: 5px;
`;
