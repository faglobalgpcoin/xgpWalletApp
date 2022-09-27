import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import styles from '../style/PasswordSettingComponent.style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from '../../config/i18n';

const PasswordHelpModal = ({isVisible, onPress}) => (
  <Modal isVisible={isVisible}>
    <View style={styles.modalContainer}>
      <View style={styles.modalCloseButton}>
        <TouchableOpacity onPress={onPress}>
          <Icon name="close" size={25} color="#bbb" />
        </TouchableOpacity>
      </View>
      <View style={styles.modalHeader}>
        <Icon name="lock" size={50} color={'#bfbfbf'} />
        <Text style={[styles.modalHeaderText]}>
          {I18n.t('asset.password_help_modal_title')}
        </Text>
      </View>
      <View style={styles.modalContent}>
        <Text style={styles.modalDetailText}>
          {I18n.t('asset.password_help_modal_using_desc')}
        </Text>
        <Text style={styles.modalDetailText}>
          {I18n.t('asset.password_help_modal_new_password_desc')}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.modalButton}>
          <Text style={{color: 'white'}}>{I18n.t('confirm')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default PasswordHelpModal;
