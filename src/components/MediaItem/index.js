import React, { Component } from 'react';
import { Image, View, Dimensions, TouchableOpacity } from 'react-native';

const checkedIcon  = require("../../assets/images/check-mark.png");
import styles from './styles'

class MediaItem extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      item:     {},
      selected: false,
      imageSize: 0
    };
  }
  
  componentWillMount() {
    let { width } = Dimensions.get( 'window' );
    let { imageMargin, itemsPerRow, containerWidth } = this.props;
    
    if ( typeof containerWidth !== "undefined" ) {
      width = containerWidth;
    }
    this.setState({imageSize: (width - (itemsPerRow + 1) * imageMargin) / itemsPerRow})
  }
  
  /**
   * @description Render default marker
   * @param markIcon
   * @return {XML}
   */
  renderMarker(markIcon) {
    return(
      <Image style={styles.marker} source={markIcon ? markIcon : checkedIcon}/>
    )
  };
  
  /**
   * @description Trigger when file is pressed
   * @param item
   */
  onFilePress( item ) {
    this.props.onClick( item.node );
  }
  
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
          source={{ uri: item.node.image.uri }}
          style={{ height: this.state.imageSize, width: this.state.imageSize }}/>
        {selected && marker}
        {selected && <View style={styles.overlay}/>}
      </TouchableOpacity>
    );
  }
  
}
export default MediaItem;
