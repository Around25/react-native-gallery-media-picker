import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, TouchableOpacity, Text, Image } from 'react-native';
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
    this.setState({
      rows: this.splitIntoRows(this.props.images, this.props.itemsPerRow)
    });
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
   * @description Select media file function
   * @param item
   */
  selectMediaFile(item) {
    let { maximumSelectedFiles, itemsPerRow, callback, selectSingleItem } = this.props;
    let selected = this.state.selected,
      index = existsInArray( selected, 'image', 'uri', item.image.uri );

    if ( index >= 0 ) {
      selected.splice( index, 1 );
    } else {
      if ( selectSingleItem ) {
        selected.splice( 0, selected.length );
      }
      if ( selected.length < maximumSelectedFiles ) {
        selected.push( item );
      }
    }
    this.setState( {
      selected:   selected,
      // dataSource:  this.filterMediaRow( this.state.images, itemsPerRow )
    } );

    callback(selected, item);
  }

  backToAlbums () {
    this.setState({
      selected: []
    });
    this.props.callback([], null);
    this.props.onBackPress();
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

    let uri = item.image.uri;
    let isSelected = (existsInArray(selected, 'image', 'uri', uri) >= 0);

    return (
      <MediaItem
        key={uri + index}
        markIcon={markIcon}
        item={item}
        selected={isSelected}
        imageMargin={imageMargin}
        customSelectMarker={customSelectMarker}
        itemsPerRow={itemsPerRow}
        containerWidth={containerWidth}
        onClick={this.selectMediaFile.bind(this)}
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
    if (!this.state.finishedLoading) {
      return <ActivityIndicator color={this.props.activityIndicatorColor}/>;
    }
    return null;
  }

  renderBackToAlbumsButton () {
    return (
      <View style={{flex: 1, padding: 7}}>
        <TouchableOpacity
          onPress={this.backToAlbums.bind(this)}
          style={{
            flex: 1,
            backgroundColor: '#cccccc',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
          }}>
          <Image
            source={arrow}
            style={{
              height: 20,
              width: 20,
              marginRight: 5,
              transform: [{rotate: '180deg'}],
            }} />
          <Text>Back to albums</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderList () {
    return (
      <View style={{flex: 14}}>
        <FlatList
          ListFooterComponent={this.renderFooterLoader.bind(this)}
          initialNumToRender={this.props.batchSize}
          onEndReached={this.onEndReached.bind(this)}
          renderItem={({item, index}) => this.renderRow(item, index)}
          keyExtractor={(item, index) => item[0].image.uri + item[0].timestamp + index}
          data={this.state.rows}
          extraData={this.props.selected}
        />
      </View>
    );
  }

  render () {
    return (
      <View
        style={{
          flex: 1
        }}>
        {this.renderBackToAlbumsButton()}
        {this.renderList()}
      </View>
    );
  }
}

export default MediaList;