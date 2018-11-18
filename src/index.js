import React, { Component } from 'react';
import { CameraRoll, Platform, View, Text, FlatList, ActivityIndicator } from 'react-native';
import _ from 'lodash'
import AlbumsList from '../src/components/AlbumsList';
import MediaList from '../src/components/MediaList';
import styles from './styles';

class GalleryMediaPicker extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      images:                    [],
      selected:                  this.props.selected,
      lastCursor:                null,
      fetching:                  true,
      loadingMore:               false,
      noMoreFiles:               false,
      batchSize:                 1,
      dataSource:                [],
      groupTypes:                'SavedPhotos',
      maximumSelectedFiles:      15,
      itemsPerRow:              3,
      imageMargin:               5,
      activityIndicatorSize:     'small',
      activityIndicatorColor:    '#000000',
      selectSingleItem:          false,
      assetType:                 'Photos',
      backgroundColor:           'white',
      emptyGalleryText:          'There are no photos or videos',
      albums:                    [],
      albumSelected:             ''
    };
  }

  componentWillMount() {
    this.getFiles();
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( { selected: nextProps.selected } );
  }

  /**
   * @description Get files from camera roll
   */
  getFiles () {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => {
        this.getCameraRollFiles();
      });
    }
  }

  /**
   * @description Fetch camera roll files
   */
  getCameraRollFiles() {
    let { groupTypes, assetType, firstLimit } = this.props;

    let fetchParams = {
      first: firstLimit !== undefined ? firstLimit : 1000,
      groupTypes: groupTypes,
      assetType: assetType,
    };

    if (Platform.OS === "android") {
      delete fetchParams.groupTypes;
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    console.log(fetchParams);


    CameraRoll.getPhotos(fetchParams)
      .then((data) => this.appendFiles(data), (e) => console.error(e));
  }

  /**
   * @description This function is sorting files and put them on the state
   * @param data
   */
  appendFiles(data) {
    let assets = data.edges;

    this.extract(assets);

    let newState = {
      loadingMore: false,
      fetching: false,
    };

    if (!data.page_info.has_next_page) {
      newState.noMoreFiles = true;
    }

    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.images = this.state.images.concat(assets);
      newState.dataSource = this.filterMediaRow(newState.images, this.props.itemsPerRow)
    }

    this.setState(newState);
  }

  /**
   * @description Extracts images from array
   */
  extract (items) {
    let res = items.map(item => item.node);
    this.sort(res);
  }


  /**
   * @description Sorts images based on album
   */
  sort (items) {
    let albums = [];
    grouped = Object.values(_.groupBy(items, (item) => item.group_name));
    grouped.map(list => {return albums.push({albumName: list[0].group_name, photos: list})});
    console.log(albums);

    this.setState({
      albums
    });
  }


  selectAlbum (albumName) {
    this.setState({
      albumSelected: albumName
    });
  }


  /**
   * @description Render background color for the container
   * @return {string}
   */
  renderBackgroundColor(){
    return this.props.backgroundColor !== undefined ? this.props.backgroundColor : this.state.backgroundColor;
  }

  /**
   * @description Render default loader style
   * @return {{color: string, size: string}}
   */
  renderLoaderStyle(){
    let props = this.props;
    return {
      color: props.activityIndicatorColor !== undefined ? props.activityIndicatorColor : this.state.activityIndicatorColor,
      size: props.activityIndicatorSize !== undefined ? props.activityIndicatorSize : this.state.activityIndicatorSize
    }
  }

  /**
   * @description On list end reached , load more files if there are any
   */
  onEndReached() {
    if (!this.state.noMoreFiles) {
      this.getFiles();
    }
  }

  /**
   * @description Select media file function
   * @param item
   */
  selectMediaFile( item ) {
    let { maximumSelectedFiles, itemsPerRow, callback, selectSingleItem } = this.props;
    let selected = this.state.selected,
      index = this.existsInArray( selected, 'uri', item.image.uri );

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
      dataSource:  this.filterMediaRow( this.state.images, itemsPerRow )
    } );

    callback(selected, item);
  }

  /**
   * @description Sort
   * @param files
   * @param numberOfRows
   * @return {Array}
   */
  filterMediaRow( files, numberOfRows ) {
    let result = [],
      temp = [];

    for ( let i = 0; i < files.length; ++i ) {
      if ( i > 0 && i % numberOfRows === 0 ) {
        result.push( temp );
        temp = [];
      }
      temp.push( files[ i ] );
    }

    if ( temp.length > 0 ) {
      while ( temp.length !== numberOfRows ) {
        temp.push( null );
      }
      result.push( temp );
    }

    return result;
  }

  /**
   * @param array
   * @param property
   * @param value
   */
  existsInArray( array, property, value ) {
    return array.map( ( o ) => {
      return o.image[ property ];
    } ).indexOf( value );
  }

  renderMedia () {
    if (!this.state.albumSelected) {
      return (
        <AlbumsList
          albums={this.state.albums}
          onAlbumPress={this.selectAlbum.bind(this)}/>
      );
    } else {
      return (
        <MediaList
          dataSource={this.state.dataSource}
          batchSize={this.props.batchSize || this.state.batchSize}
          imageMargin={this.props.imageMargin || this.state.imageMargin}
          emptyGalleryText={this.props.emptyGalleryText || this.state.emptyGalleryText}
          emptyTextStyle={this.props.emptyTextStyle || {}}
          customLoader={this.props.customLoader || {}}
          customSelectMarker={this.props.customSelectMarker || {}}
          onEndReached={this.onEndReached.bind(this)}
          selected={this.state.selected}
          noMoreFiles={this.state.noMoreFiles}
          activityIndicatorColor={this.state.activityIndicatorColor}
          itemsPerRow={this.state.itemsPerRow}
          containerWidth={this.props.containerWidth}
          markIcon={this.props.markIcon}
          existsInArray={this.existsInArray}
          selectMediaFile={this.selectMediaFile} />
      );
    }
  }

  render () {
    return (
      <View style={styles.base}>
        {this.renderMedia()}
      </View>
    );
  }
}

export default GalleryMediaPicker;
