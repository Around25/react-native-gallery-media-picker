import React, { Component } from 'react';
import { CameraRoll, Platform, View, Text, FlatList, ActivityIndicator } from 'react-native';
import _ from 'lodash'
import MediaItem from '../src/components/MediaItem';
import styles from './styles';
import AlbumsList from "../src/components/AlbumsList";

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
      emptyGalleryText:          'There are no photos or video',
      albums:                    []
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
  getFiles() {
    if ( !this.state.loadingMore ) {
      this.setState({loadingMore: true}, () => {
        this.getCameraRollFiles();
      });
    }
  }
  
  /**
   * @description Fetch camera roll files
   */
  getCameraRollFiles() {
    let {groupTypes, assetType, firstLimit} = this.props;
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
    
    CameraRoll.getPhotos(fetchParams)
      .then((data) => this.appendFiles(data), (e) => console.error(e));
  }
  
  /**
   * @description This function is sorting files and put them on the state
   * @param data
   */
  appendFiles(data) {
    let assets = data.edges;
    this.extract(assets)
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
    this.setState( newState );
  }

  
  
  extract = (items) => {
    let res = items.map(item => item.node);
    this.sort(res)
  };
  
  sort = (items) => {
    let albums = [];
    grouped = Object.values(_.groupBy(items, function(item) {return item.group_name }) )
    grouped.map(list => {return albums.push({albumName: list[0].group_name, photos: list})})
    this.setState({albums})
  };
  
  
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
   * @description Render media item
   * @param item
   * @return {XML}
   */
  renderMediaItem( item, index ) {
    let { selected } = this.state;
    let {
      imageMargin,
      customSelectMarker,
      markIcon,
      itemsPerRow,
      containerWidth
    } = this.props;
    
    let uri = item.node.image.uri;
    let isSelected = (this.existsInArray( selected, 'uri', uri ) >= 0);

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
        onClick={this.selectMediaFile.bind( this )}
      />
    );
  }
  
  /**
   * @description Render list row
   * @param rowData
   * @return {XML}
   */
  renderRow( rowData, index ) {
    let items = rowData.map( ( item ) => {
      if ( item === null ) {
        return null;
      }
      return this.renderMediaItem( item, index );
    } );
    
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
    if ( !this.state.noMoreFiles ) {
      return <ActivityIndicator color={this.state.activityIndicatorColor}/>;
    }
    return null;
  }
  
  /**
   * @description On list end reached , load more files if there are any
   */
  onEndReached() {
    if ( !this.state.noMoreFiles ) {
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
    
    callback( selected, item );
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
  
  render() {
    let { dataSource, albums } = this.state;
    let {
      batchSize,
      imageMargin,
      emptyGalleryText,
      emptyTextStyle,
      customLoader,
    } = this.props;
  
    return (
      <View style={styles.base}>
        <AlbumsList albums={albums}/>
        {/*{ dataSource.length > 0 ? (*/}
          {/*<FlatList*/}
            {/*style={{flex: 1}}*/}
            {/*ListFooterComponent={this.renderFooterLoader.bind(this)}*/}
            {/*initialNumToRender={batchSize}*/}
            {/*onEndReached={this.onEndReached.bind(this)}*/}
            {/*renderItem={({item, index}) => this.renderRow(item, index)}*/}
            {/*keyExtractor={(item, index) => item[0].node.image.uri+item[0].timestamp+index}*/}
            {/*data={dataSource}*/}
            {/*extraData={this.state.selected}*/}
          {/*/>*/}
        {/*) : (*/}
          {/*<Text style={[styles.emptyText, emptyTextStyle]}>{emptyGalleryText}</Text>*/}
        {/*)}*/}
      </View>
    );
  }
  
  
}

export default GalleryMediaPicker;
