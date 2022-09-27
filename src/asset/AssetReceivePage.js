import React from "react";
import {
  Clipboard,
  Dimensions,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { inject, observer } from "mobx-react";
import { CheckBox } from "react-native-elements";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-simple-toast";
import styled from "styled-components";
import I18n from "i18n-js";
import LinearGradient from "react-native-linear-gradient";

import DefaultColors from "../common/style/DefaultColors";

const { height } = Dimensions.get("window");

@inject("assetReceiveStore", "memberStore")
@observer
class AssetReceivePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${I18n.t("gp.receive_token", {
        name: navigation.state.params.symbol,
      })}`,
      headerTitleStyle: { fontWeight: "bold" },
      headerStyle: { backgroundColor: DefaultColors.mainColorToneDown },
      headerTransparent: true,
    };
  };

  componentWillMount() {
    console.log(this.props.memberStore);
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
    this.props.assetReceiveStore.setInitialStore({
      code: this.props.navigation.state.params.symbol,
      address:
        this.props.navigation.state.params.type === "luniverse"
          ? this.props.memberStore.address
          : this.props.navigation.state.params.type === "ethereum"
          ? this.props.memberStore.ethAddress
          : this.props.memberStore.btcAddress,
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.assetReceiveStore.reset();
  }

  writeToClipboard = () => {
    Clipboard.setString(this.props.assetReceiveStore.address);
    Toast.show(
      I18n.t("gp.address_copy_complete", {
        name: I18n.t("gp.address"),
      })
    );
  };

  keyboardDidShow = () => {
    this.props.assetReceiveStore.setIsKeyboardShowTrue();
  };

  keyboardDidHide = () => {
    this.props.assetReceiveStore.setIsKeyboardShowFalse();
  };

  render() {
    const props = { code: this.props.navigation.state.params.symbol };
    const store = this.props.assetReceiveStore;

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // colors={[DefaultColors.mainColorToneDown, DefaultColors.mainColor]}
          // colors={[DefaultColors.secondColorLight, DefaultColors.mainColor]}
          colors={[DefaultColors.lightGray, DefaultColors.lightToneDownGray]}
        >
          <ModalContainer>
            <View>
              <CheckBox
                checked={store.isChecked}
                onPress={store.handlePressCheckbox}
                title={I18n.t("gp.write_receive_amount")}
                containerStyle={CheckBoxContainer}
                textStyle={CheckBoxText}
                checkedColor="#465D7F"
                size={20}
              />
              <AmountInputContainer
                isChecked={store.isChecked ? "" : "notEditable"}
              >
                <AmountInput
                  editable={store.isChecked}
                  value={store.amountInput}
                  onChangeText={store.handleChangeAmount}
                  onBlur={store.handleBlurAmount}
                  placeholder={I18n.t("gp.amount")}
                  keyboardType={"decimal-pad"}
                />
              </AmountInputContainer>
            </View>

            <ContentContainer>
              {store.isChecked && (
                <DescContainer>
                  <Desc>
                    {I18n.t("gp.send_please_desc", {
                      code: props.code,
                      amount: store.amountInput,
                    })}
                  </Desc>
                </DescContainer>
              )}
              {Platform.OS === "android" && store.isKeyboardShow ? null : (
                <QRCodeContainer>
                  <QRCode
                    size={280}
                    value={store.qrCodeUri}
                    color="black"
                    backgroundColor="white"
                  />
                </QRCodeContainer>
              )}
            </ContentContainer>

            <AddressContainer
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              // colors={[DefaultColors.secondColorToneDown, "#458ce9"]}
              colors={[
                DefaultColors.mainColor,
                DefaultColors.mainColorToneDown,
              ]}
            >
              <AddressButton onPressOut={this.writeToClipboard}>
                <Address>{store.address}</Address>
                <Icon
                  size={18}
                  name="content-copy"
                  color="#fefefe"
                  style={{ marginRight: 10 }}
                />
              </AddressButton>
            </AddressContainer>
          </ModalContainer>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const Container = styled(LinearGradient)`
  flex: 1;
  background: ${DefaultColors.mainColorToneDown};
`;

const ModalContainer = styled.View`
  flex: 1;
  margin-top: ${height * 0.14}px;
  margin-bottom: ${height * 0.14 - 20}px;
  margin-horizontal: 20px;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;

  border-radius: 7px;
`;

const AddressContainer = styled(LinearGradient)`
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: ${DefaultColors.mainColorToneUp};

  height: 55px;
`;

const AddressButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Address = styled.Text`
  width: 90%;
  padding-left: 10;
  padding-right: 7;
  font-size: 13;
  color: #fff;

  padding-left: 7;
`;

const ContentContainer = styled.View`
  justify-content: space-evenly;
`;

const DescContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const Desc = styled.Text`
  align-self: center;
  color: #474747;
  font-size: 15;
`;

const QRCodeContainer = styled.View`
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5px 20px 0 20px;
`;

const CheckBoxContainer = {
  justifyContent: "center",
  paddingTop: 0,
  marginTop: 0,
  paddingBottom: 5,
  borderWidth: 0,
  paddingLeft: 10,
  backgroundColor: "#fff",

  paddingTop: 25,
  paddingBottom: 5,
};

const CheckBoxText = (isChecked) => {
  return {
    fontSize: 14,
    fontWeight: "400",
    alignItems: "center",
    color: isChecked ? "red" : "blue",
  };
};

const AmountInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 10;
  margin-bottom: 20;
  margin-horizontal: 15;
  background-color: #fff;
  border-width: 1;
  border-color: #e6e6e6;
  border-radius: 4;

  margin-bottom: 0;
`;
const AmountInput = styled.TextInput`
  flex: 1;
  font-size: 13;
  padding-vertical: 13px;

  padding-vertical: 15px;
`;

export default AssetReceivePage;
