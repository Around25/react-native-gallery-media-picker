import React, { Component } from 'react';
import RNThumbnail from 'react-native-thumbnail-a25av';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import styles from './styles'
const checkedIcon  = require("../../assets/images/check-mark.png");

class AlbumItem extends Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    let { albumName, thumbnail, counter, index } = this.props;
    return (
      <TouchableOpacity
        style={[styles.base, index === 0 && styles.first]}
        onPress={() => this.props.onAlbumPress(albumName)}>
        <Image source={{uri: thumbnail}} style={styles.thumb}/>
        <View style={styles.textWrapper}>
          <Text style={styles.name}>{albumName}</Text>
          <Text style={styles.counter}>{`${counter} ${counter && counter > 1 ? 'Photos' : 'Photo'}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }

}
export default AlbumItem;
