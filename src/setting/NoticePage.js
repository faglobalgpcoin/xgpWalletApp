import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import HTMLView from "react-native-htmlview";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { inject, observer } from "mobx-react";
import { BallIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

import styles from "./style/NoticePage.style";
import LineSeparator from "../common/component/LineSeparator";
import { TimestampToDatetimeLocale } from "../common/function/TimestampToDatetime";
import DefaultColors from "../common/style/DefaultColors";

@inject("noticeStore", "memberStore")
@observer
class NoticePage extends React.Component {
  async componentWillMount() {
    const store = this.props.noticeStore;

    store.setIsLoadingTrue();
    await store.updateNoticeList(this.props.memberStore.accessToken);
    store.setIsLoadingFalse();
  }

  componentWillUnmount() {
    this.props.noticeStore.reset();
  }

  wrapHtmlContent = (content) => `<div>${content}</div>`;

  renderSectionTitle = () => <LineSeparator />;

  renderHeader = ({ title, createdAt }) => {
    return (
      <View style={styles.noticeContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.dateText}>
            {TimestampToDatetimeLocale(createdAt)}
          </Text>
        </View>
        <MIcon name="chevron-right" size={30} color={DefaultColors.mainColor} />
      </View>
    );
  };

  renderContent = ({ content }) => {
    return (
      <View style={styles.contentContainer}>
        <HTMLView value={this.wrapHtmlContent(content)} stylesheet={styles} />
      </View>
    );
  };

  render() {
    const store = this.props.noticeStore;
    return (
      <ScrollView>
        <Spinner
          visible={store.isLoading}
          textStyle={styles.indicatorText}
          overlayColor={"transparent"}
          customIndicator={
            <BallIndicator color={DefaultColors.mainColorToneDown} size={30} />
          }
        />
        <Accordion
          expandMultiple
          sections={store.notices.slice() || []}
          activeSections={store.activeSections.slice() || []}
          touchableComponent={TouchableOpacity}
          renderSectionTitle={this.renderSectionTitle}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          onChange={store.updateSections}
        />
        <LineSeparator />
      </ScrollView>
    );
  }
}

export default NoticePage;
