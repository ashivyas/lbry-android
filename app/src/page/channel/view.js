// @flow
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { navigateBack } from 'utils/helper';
import Colors from 'styles/colors';
import Button from 'component/button';
import FileList from 'component/fileList';
import PageHeader from 'component/pageHeader';
import UriBar from 'component/uriBar';
import channelPageStyle from 'styles/channelPage';

class ChannelPage extends React.PureComponent {
  state = {
    page: 1
  };

  componentDidMount() {
    const { uri, page, claimsInChannel, fetchClaims, fetchClaimCount } = this.props;

    if (!claimsInChannel || !claimsInChannel.length) {
      fetchClaims(uri, page || this.state.page);
      fetchClaimCount(uri);
    }
  }

  handlePreviousPage = () => {
    const { uri, fetchClaims } = this.props;
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 }, () => {
        fetchClaims(uri, this.state.page);
      });
    }
  }

  handleNextPage = () => {
    const { uri, fetchClaims, totalPages } = this.props;
    if (this.state.page < totalPages) {
      this.setState({ page: this.state.page + 1 }, () => {
        fetchClaims(uri, this.state.page);
      });
    }
  }

  render() {
    const {
      fetching,
      claimsInChannel,
      claim,
      navigation,
      totalPages,
      uri,
      drawerStack,
      popDrawerStack
    } = this.props;
    const { name, permanent_url: permanentUrl } = claim;

    let contentList;
    if (fetching) {
      contentList = (
        <View style={channelPageStyle.busyContainer}>
          <ActivityIndicator size="large" color={Colors.LbryGreen} />
          <Text style={channelPageStyle.infoText}>Fetching content...</Text>
        </View>
      );
    } else {
      contentList =
        claimsInChannel && claimsInChannel.length ? (
          <FileList sortByHeight
                    hideFilter
                    fileInfos={claimsInChannel}
                    navigation={navigation}
                    style={channelPageStyle.fileList} />
        ) : (
          <View style={channelPageStyle.busyContainer}>
            <Text style={channelPageStyle.infoText}>No content found.</Text>
          </View>
        );
    }

    return (
      <View style={channelPageStyle.container}>
        <PageHeader title={name} onBackPressed={() => navigateBack(navigation, drawerStack, popDrawerStack)} />
        {contentList}
        {(totalPages > 1) &&
        <View style={channelPageStyle.pageButtons}>
          <View>
            {(this.state.page > 1) && <Button
                                        style={channelPageStyle.button}
                                        text={"Previous"}
                                        disabled={!!fetching}
                                        onPress={this.handlePreviousPage} />}
          </View>
          {(this.state.page < totalPages) && <Button
                                               style={[channelPageStyle.button, channelPageStyle.nextButton]}
                                               text={"Next"}
                                               disabled={!!fetching}
                                               onPress={this.handleNextPage} />}
        </View>}
        <UriBar value={uri} navigation={navigation} />
      </View>
    )
  }
}

export default ChannelPage;
