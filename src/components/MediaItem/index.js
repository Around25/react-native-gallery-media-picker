import React, { Component } from 'react';
import RNThumbnail from 'react-native-thumbnail-a25av';
import { Image, View, Dimensions, TouchableOpacity, Platform } from 'react-native';

const checkedIcon  = require("../../assets/images/check-mark.png");
import styles from './styles'

class MediaItem extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      item:     {},
      selected: false,
      imageSize: 0,
      thumbnailPath: 'dummy'
    };

    this.generateThumbnail = this.generateThumbnail.bind(this);
  }

  componentWillMount () {
    let { width } = Dimensions.get( 'window' );
    let { imageMargin, itemsPerRow, containerWidth } = this.props;

    if ( typeof containerWidth !== "undefined" ) {
      width = containerWidth;
    }
    this.setState({imageSize: (width - (itemsPerRow + 1) * imageMargin) / itemsPerRow})
  }

  componentDidMount () {
    if (this.state.thumbnailPath === 'dummy') {
      this.generateThumbnail();
    }
  }

  generateThumbnail () {
    let thumbnailPath = this.props.item.node.image.uri;

    if (Platform.OS === 'ios') {
      this.setState({
        thumbnailPath
      });
    } else if (Platform.OS === 'android') {
      RNThumbnail
        .get(thumbnailPath)
        .then((result) => {
          this.setState({
            thumbnailPath: result.path
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  /**
   * @description Trigger when file is pressed
   * @param item
   */
  onFilePress( item ) {
    this.props.onClick( item.node );
  }

  /**
   * @description Render default marker
   * @param markIcon
   * @return {XML}
   */
  renderMarker( markIcon ) {
    return(
      <Image style={styles.marker} source={markIcon ? markIcon : checkedIcon}/>
    )
  };

  render() {
    let {
      item,
      selected,
      customSelectMarker,
      imageMargin,
      markIcon
    } = this.props;

    let marker = customSelectMarker ? customSelectMarker : this.renderMarker(markIcon);

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this.onFilePress( item )}>
        <Image
          source={{ uri: this.state.thumbnailPath }}
          style={{ height: this.state.imageSize, width: this.state.imageSize, backgroundColor: '#000000' }}/>
        {selected && marker}
        {selected && <View style={styles.overlay}/>}
      </TouchableOpacity>
    );
  }

}
export default MediaItem;
