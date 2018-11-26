import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, TouchableOpacity, Text, Image } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import MediaItem from '../MediaItem';
import styles from './styles';
import { existsInArray, placeInTime } from '../../utils';

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
   * @description Split all the images by their time tag (placeInTime) and create the arrays for each row with itemsPerRow elements
   * @param images
   * @param itemsPerRow
   * @return {Array}
   */
  splitIntoRows (images, itemsPerRow) {
    let result = {};
    let temp = {};

    for ( let i = 0; i < images.length; ++ i ) {
      const timestampOfImage = images[i].timestamp * 1000;
      const placeInTimeOfImage = placeInTime(timestampOfImage);

      if (temp[placeInTimeOfImage] === undefined) {
        temp[placeInTimeOfImage] = [];
      }

      temp[placeInTimeOfImage].push(images[i]);

      if (temp[placeInTimeOfImage].length > 0 && temp[placeInTimeOfImage].length % itemsPerRow === 0) {
        if (result[placeInTimeOfImage] === undefined) {
          result[placeInTimeOfImage] = [];
        }
        result[placeInTimeOfImage].push(temp[placeInTimeOfImage]);
        temp[placeInTimeOfImage] = [];
      }
    }

    for (let prop in temp) {
      if (temp[prop].length > 0) {
        while (temp[prop].length !== itemsPerRow) {
          temp[prop].push(null);
        }

        if (result[prop] === undefined) {
          result[prop] = [];
        }
        result[prop].push(temp[prop]);
      }
    }

    let final = [];
    let order = ['today', 'week', 'month'];
    let allTimeTags = Object.keys(result).map(prop => {
      if (Number.isInteger(parseInt(prop))) {
        return parseInt(prop);
      }

      return prop;
    });

    let allMonths = allTimeTags.filter(prop => Number.isInteger(prop) && prop < 12);
    allMonths = _.reverse(_.sortBy(allMonths));
    let allYears = allTimeTags.filter(prop => Number.isInteger(prop) && !allMonths.includes(prop));
    allYears = _.reverse(_.sortBy(allYears));

    order = _.concat(order, allMonths, allYears);

    for (let prop of order) {
      if (result[prop]) {
        final = _.concat(final, result[prop]);
      }
    }

    console.log(order);
    console.log(result);

    return final;
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

  renderRowHeader (rowData) {
    let headerTitle = placeInTime(rowData[0].timestamp * 1000);

    if (Number.isInteger(headerTitle) && headerTitle < 12) {
      headerTitle = moment(headerTitle).format('MMMM');
    }

    if (headerTitle === 'today') {
      headerTitle = 'Today';
    }

    if (headerTitle === 'week') {
      headerTitle = 'This Week';
    }

    if (headerTitle === 'month') {
      headerTitle = 'This Month'
    }

    return (
      <View
        style={{
          alignItems: 'center'
        }}>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: 7,
            color: '#aaaaaa'
          }}>{headerTitle}</Text>
      </View>
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
      <View style={{}}>
        {this.renderRowHeader(rowData)}
        <View style={styles.row}>
          {items}
        </View>
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