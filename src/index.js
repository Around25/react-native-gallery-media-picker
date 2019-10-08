import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
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
      itemsPerRow:               3,
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
    grouped.map(list => albums.push({albumName: list[0].group_name, images: list}));

    this.setState({
      albums
    });
  }


  selectAlbum (albumName) {
    this.setState({
      albumSelected: albumName
    });
  }

  deselectAlbum () {
    this.setState({
      albumSelected: ''
    });
  }

  getAlbumImages (selectedAlbumName) {
    const selectedAlbum = this.state.albums.filter((album) => album.albumName === selectedAlbumName).pop();

    return selectedAlbum.images;
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
          images={this.getAlbumImages(this.state.albumSelected)}
          itemsPerRow={this.props.itemsPerRow}
          selected={this.props.selected}
          onBackPress={this.deselectAlbum.bind(this)}
          callback={this.props.callback}
          batchSize={this.props.batchSize}
          selectMediaFile={this.selectMediaFile}
          imageMargin={this.props.imageMargin}
          markIcon={this.props.markIcon}
          customSelectMarker={this.props.customSelectMarker}
          activityIndicatorColor={this.state.activityIndicatorColor}
          maximumSelectedFiles={this.props.maximumSelectedFiles || this.state.maximumSelectedFiles}
          />
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
