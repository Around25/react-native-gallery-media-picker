import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import MediaItem from '../MediaItem';
import styles from './styles';
import { existsInArray } from '../../utils';

const arrow = require('../../assets/images/next-arrow.png');

class MediaList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      finishedLoading: false,
      rows: [],
      selected: []
    };
  }

  componentDidMount () {
    const imagesArrayWithBackButton = this.addBackButtonToList(this.props.images, this.props.customAlbumBackButton);
    // const imagesArrayWithBackButton = this.props.images;

    this.setState({
      rows: this.splitIntoRows(imagesArrayWithBackButton, this.props.itemsPerRow)
    });
  }

  addBackButtonToList (imagesArray, backButtonImage) {
    if (!backButtonImage) {
      backButtonImage = arrow;
    }

    const backButtonObject = {
      image: {
        uri: backButtonImage
      },
      timestamp: Date.now()
    }

    let copyOfImagesArray = [...imagesArray];

    copyOfImagesArray.unshift(backButtonObject);
    return copyOfImagesArray;
  }

  /**
   * @description Sort
   * @param images
   * @param itemsPerRow
   * @return {Array}
   */
  splitIntoRows (images, itemsPerRow) {
    let result = [];
    let temp = [];

    for ( let i = 0; i < images.length; ++ i ) {
      if ( i > 0 && i % itemsPerRow === 0 ) {
        result.push( temp );
        temp = [];
      }
      temp.push( images[ i ] );
    }

    if ( temp.length > 0 ) {
      while ( temp.length !== itemsPerRow ) {
        temp.push( null );
      }
      result.push( temp );
    }

    return result;
  }

  onEndReached () {
    if (!this.state.finishedLoading) {
      this.setState({
        finishedLoading: true
      });
    }
  }

  /**
   * @description Render media item
   * @param item
   * @return {XML}
   */
  renderMediaItem( item, index ) {
    console.log(item);

    let {
      selected,
      imageMargin,
      customSelectMarker,
      markIcon,
      itemsPerRow,
      containerWidth
    } = this.props;

    let uri = item.image.uri;
    let isSelected = (existsInArray(selected, 'image', 'uri', uri) >= 0);

    return (
      <MediaItem
        key={uri + index}
        isLocalFile={typeof item.image.uri === 'number'}
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

    console.log(items);


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
    if (!this.state.finishedLoading) {
      return <ActivityIndicator color={this.props.activityIndicatorColor}/>;
    }
    return null;
  }

  render () {
    return (
      <FlatList
        style={{flex: 1}}
        ListFooterComponent={this.renderFooterLoader.bind(this)}
        initialNumToRender={this.props.batchSize}
        onEndReached={this.onEndReached.bind(this)}
        renderItem={({item, index}) => {console.log(item); return this.renderRow(item, index);}}
        keyExtractor={(item, index) => item[0].image.uri + item[0].timestamp + index}
        data={this.state.rows}
        extraData={this.props.selected}
      />
    );
  }
}

export default MediaList;