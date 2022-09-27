import React from 'react';
import {Text, TouchableOpacity, View, Modal} from 'react-native';
import {observer} from 'mobx-react';
import MnemonicWordsComponent from './MnemonicWordsComponent';
import modalStyles from '../style/ModalStyles';
import DefaultColors from '../style/DefaultColors';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../config/i18n';

class MnemonicBackupModal extends React.Component {
  render() {
    const store = this.props.parentStore;
    return (
      <Modal visible={store.isVisibleBackUpModal} transparent={true}>
        {/*onRequestClose={store.handleBackupModalHide}*/}
        {/*onDismiss={store.handleBackupModalHide}>*/}
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.modalContainer}>
            <View>
              {this.props.isCreateModal ? (
                <Text style={modalStyles.modalTitle}>
                  {I18n.t('wallet.create_account_title')}
                </Text>
              ) : (
                <Text style={modalStyles.modalTitle}>
                  {I18n.t('wallet.please_write_mnemonic_word')}
                </Text>
              )}
            </View>
            <Text>
              {I18n.t('wallet.create_account_desc_mnemonic')}
              {I18n.t('wallet.create_account_desc_order')}
            </Text>
            <View style={modalStyles.mnemonicWords}>
              <MnemonicWordsComponent mnemonicWords={store.mnemonicWords} />
            </View>
            <View>
              <Text style={modalStyles.descriptionTitle}>
                {I18n.t('wallet.what_is_mnemonic_word')}
              </Text>
              <Text style={modalStyles.descriptionContent}>
                ▪︎{I18n.t('wallet.mnemonic_backup_help_use')}
              </Text>
              <Text style={modalStyles.descriptionContent}>
                ▪︎{I18n.t('wallet.mnemonic_backup_help_secure')}
              </Text>
              <Text style={modalStyles.descriptionContent}>
                ▪︎{I18n.t('wallet.mnemonic_backup_help_cold')}
              </Text>
            </View>
            <View style={modalStyles.buttons}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={modalStyles.button}
                colors={[
                  DefaultColors.mainColor,
                  DefaultColors.mainColorToneDown,
                ]}>
                <TouchableOpacity
                  onPress={store.closeBackUpModal}
                  style={modalStyles.button}
                  activeOpacity={0.8}>
                  <Text style={modalStyles.buttonText}>{I18n.t('close')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default observer(MnemonicBackupModal);
