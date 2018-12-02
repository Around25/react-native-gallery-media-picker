import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import AlbumItem from '../AlbumItem'
import styles from './styles'

class AlbumsList extends Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    let { albums } = this.props;

    return (
      <ScrollView style={{flex:1, backgroundColor: 'white'}}>
        {albums.map((album, index) => (
          <AlbumItem
            key={index}
            albumName={album.albumName}
            thumbnail={album.images[0].image.uri}
            counter={album.images.length || 0}
            index={index}
            onAlbumPress={this.props.onAlbumPress} />
        ))}
      </ScrollView>
    );
  }

}

export default AlbumsList;
