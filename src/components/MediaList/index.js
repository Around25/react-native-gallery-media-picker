import React, { Component } from 'react';
import { Text, FlatList, ActivityIndicator, View } from 'react-native';
import MediaItem from '../MediaItem';
import styles from './styles';

class MediaList extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  /**
   * @description Render media item
   * @param item
   * @return {XML}
   */
  renderMediaItem( item, index ) {
    let {
      selected,
      imageMargin,
      customSelectMarker,
      markIcon,
      itemsPerRow,
      containerWidth
    } = this.props;

    let uri = item.node.image.uri;
    let isSelected = (this.props.existsInArray(selected, 'uri', uri) >= 0);

    return (
      <MediaItem
        key={uri+index}
        markIcon={markIcon}
        item={item}
        selected={isSelected}
        imageMargin={imageMargin}
        customSelectMarker={customSelectMarker}
        itemsPerRow={itemsPerRow}
        containerWidth={containerWidth}
        onClick={this.props.selectMediaFile.bind( this )}
      />
    );
  }

  /**
   * @description Render list row
   * @param rowData
   * @return {XML}
   */
  renderRow (rowData, index) {
    let items = rowData.map((item) => {
      if (item === null) {
        return null;
      }
      return this.renderMediaItem(item, index);
    });

    return (
      <View style={styles.row}>
        {items}
      </View>
    );
  }

  /**
   * @description Render footer loader when more files are fetching
   * @return {*}
   */
  renderFooterLoader() {
    if (!this.props.noMoreFiles) {
      return <ActivityIndicator color={this.props.activityIndicatorColor}/>;
    }
    return null;
  }

  render () {
    return (
      this.props.dataSource.length > 0 ?
        <FlatList
          style={{flex: 1}}
          ListFooterComponent={this.renderFooterLoader.bind(this)}
          initialNumToRender={this.props.batchSize}
          onEndReached={this.props.onEndReached}
          renderItem={({item, index}) => this.renderRow(item, index)}
          keyExtractor={(item, index) => item[0].node.image.uri + item[0].timestamp + index}
          data={this.props.dataSource}
          extraData={this.props.selected}
        />
        : <Text style={[styles.emptyText, this.props.emptyTextStyle]}>{this.props.emptyGalleryText}</Text>
    );
  }
}

export default MediaList;