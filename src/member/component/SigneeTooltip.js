import {Text, Platform} from 'react-native';
import I18n from '../../config/i18n';
import React from 'react';
import styled from 'styled-components';

export const SigneeTooltip = () => (
  <PaddingView>
    <TooltipRow>
      <TooltipBullet>️👤</TooltipBullet>
      <Text>{I18n.t('member.signee_tooltip_did')}</Text>
    </TooltipRow>
    <TooltipRow>
      <TooltipBullet>⛓️</TooltipBullet>
      <Text>{I18n.t('member.signee_tooltip_client')}</Text>
    </TooltipRow>
    <TooltipRow>
      <TooltipBullet>🔑️</TooltipBullet>
      <Text>{I18n.t('member.signee_tooltip_secure')}</Text>
    </TooltipRow>
  </PaddingView>
);

const PaddingView = styled.View`
  padding-right: ${Platform.OS === 'ios' ? '20' : '15'}px;
  padding-bottom: 10px;
`;

const TooltipRow = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const TooltipBullet = styled.Text`
  margin-right: 5px;
`;
