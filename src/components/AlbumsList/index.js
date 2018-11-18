import React, { Component } from 'react';
import RNThumbnail from 'react-native-thumbnail-a25av';
import { View, Text, ScrollView } from 'react-native';

const checkedIcon  = require("../../assets/images/check-mark.png");
import AlbumItem from '../AlbumItem'
import styles from './styles'

class AlbumsList extends Component {
  constructor( props ) {
    super( props );
    this.state = {

    };
  }



  render() {
    let { albums } = this.props;

    return (
      <ScrollView style={{flex:1, backgroundColor: 'white'}}>
        {albums.map((album, index) => (
          <AlbumItem
            key={index}
            albumName={album.albumName}
            thumbnail={album.photos[0].image.uri}
            counter={album.photos.length || 0}
            index={index}
            onAlbumPress={this.props.onAlbumPress} />
        ))}
      </ScrollView>
    );
  }

}

export default AlbumsList;
