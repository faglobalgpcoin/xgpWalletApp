import React from 'react';
import {View, Alert} from 'react-native';
import {inject, observer} from 'mobx-react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './AssetQRCodeScanPage.style';
import messageProvider from '../common/MessageProvider';
import CustomQRMarker from '../common/component/CustomQRMarker';
import DefaultColors from '../common/style/DefaultColors';

@inject('assetSendStore')
@observer
class AssetQRCodeScanPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: DefaultColors.mainColorToneDown,
      },
      headerTintColor: 'white',
    };
  };

  onSuccess = e => {
    try {
      const uriArray = e.data.split(':');

      if (uriArray.length > 1) {
        this.tokenType = uriArray[0];
        this.address = uriArray[1];

        if (this.isIncludeAmountUri(this.address)) {
          const addressUriArray = this.address.split('?amount=');
          this.address = addressUriArray[0];
          this.amount = addressUriArray[1];
        }

        this.props.navigation.pop();
        this.props.assetSendStore.setQrScannerInfo(
          this.tokenType,
          this.address,
          this.amount,
        );
      } else {
        this.address = uriArray[0];
        this.props.navigation.pop();
        this.props.assetSendStore.setQrScannerInfo(
          null,
          this.address,
          null
        );
      }
    } catch (e) {
      Alert.alert(
        messageProvider.asset.qrcode_error,
        messageProvider.common.please_try_again,
      );
      console.log(' === QRCode Scan error: ', e);
    }
  };

  isIncludeAmountUri = uri => uri.includes('?amount=');

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          showMarker
          onRead={this.onSuccess}
          cameraStyle={styles.cameraContainer}
          cameraProps={{captureAudio: false}}
          customMarker={
            <CustomQRMarker
              width={300}
              height={300}
              borderColor={'white'}
              borderWidth={5}
              type={'asset'}
            />
          }
        />
      </View>
    );
  }
}

export default AssetQRCodeScanPage;
