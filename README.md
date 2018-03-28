# react-native-gallery-media-picker

[![N|Solid](https://around25.com/static/img/a25-logo-color.png)](https://nodesource.com/products/nsolid)

This is a react-native component that fetches gallery files ( images and video ) and render them in a list. Every picture or video can be selected the array with selected items is returned in a callback.

  - works on iOS and Android

### Features

  - fetchs images and videos from gallery 
  - set maximum number of selected items
  - custom loader component
  - customizable default loader
  - option to select just one item
  - option to change the number of initial list size
  - fetch only Photos, only Videos or both
  - set assets location ( albums )
  - custom text if there are no photos or videos in gallery
  - set number of items per row
  - set media file margins
  - 


### Installation

```sh
$ npm install react-native-gallery-files-picker --save
```

### iOS

Add in `info.plist` 

```<plist version="1.0">
  <dict>
    ...
    <key>NSPhotoLibraryUsageDescription</key>
    <string>$(PRODUCT_NAME) would like access to your photo gallery</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>$(PRODUCT_NAME) would like to save photos to your photo gallery</string>
  </dict>
</plist>
```

### Android

Add the required permissions in `AndroidManifest.xml`

```
<uses-permission android:name="android.permission.CAMERA" />
```
And then request camera permission in your component

```
import { PermissionsAndroid } from 'react-native';


  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission accepted")
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  ```

### Options



| Option | iOS    | Android | Description | Default | Options | Type
|:------:|:------:|:-------:|:----:|:-------------:|:--------:|:----:|
| `batchSize` | YES | YES | How many items to render in the initial batch. This should be enough to fill the screen but not much more. | ***1*** | - | **{integer}**
| `groupTypes` | YES | NO | Specifies which group types to filter the results to | ***SavedPhotos*** | *All*, *Album*, *Event*, *Faces*, *Library*, *PhotoStream*, *SavedPhotos* | **{string}**
| `assetType` | YES | YES | Specifies filter on assets | ***Photos*** | *All*, *Photos*, *Videos* | **{string}**
| `selectSingleItem` | YES | YES | If `true` only one item can be selected | ***false*** | *true*, *false* | **{boolean}**
| `emptyGalleryText` | YES | YES | Specifies the text to display if there are no images or videos | ***There are no photos or video*** | - | **{string}**
| `maximumSelectedFiles` | YES | YES | Specifies the number of files that can be selected | ***15*** | - | **{integer}**
| `selected` | YES | YES | Specifies the array with selected files that are retuned from callback in your component | ***[]***  | - | **{array}**
| `itemsPerRow` | YES | YES | Specifies the number of items on one row | ***3***  | - | **{integer}**
| `itemsPerRow` | YES | YES | Specifies margins of the image | ***5***  | - | **{integer}**
| `customLoader` | YES | YES | Specifies custom component with loading indicator | ***<ActivityIndicator/>***  | - | **{component}**
| `customSelectMarker` | YES | YES | Specifies custom component with select marker | ***<Image/>***  | - | **{component}**
| `markIcon` | YES | YES | Specifies custom icon for default marker | - | - | **{image}**

### Methods
| Method | Description | Type
|:------:|:-----------:|:----:|
| `callback` | Callback with selected files and current selected file | ***{function}***

### Example 

```javascript
import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Image, PermissionsAndroid } from 'react-native';

import GalleryMediaPicker from 'react-native-gallery-media-picker'
const marker = require('./check.png');

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      totalFiles: 0,
      selected: [],
      hasPermission: false
    }
  }
  

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({hasPermission: true })
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  
  componentWillMount(){
    this.requestCameraPermission();
  }
  
  getSelectedFiles(files, current) {
    this.setState({ totalFiles: files.length, selected: files });
    console.log('Current: ',current);
    console.log(this.state.selected);
  }
  
  /**
  * @description Render custom loader that shows when files are fetching
  */
  renderLoader(){
    return(
      <ActivityIndicator color="red" size="large"/>
    )
  }
  
  /**
  * @description Render custom marker
  * This will cancel the "markIcon" option
  */  
  renderSelectMarker(){
    return(
    <View style={styles.markerWrapper}>
      <Image source={marker} style={styles.marker}/>
    </View>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        {this.state. hasPermission && <GalleryMediaPicker
          groupTypes='All'
          assetType='All'
          markIcon={marker}
          customSelectMarker={this.renderSelectMarker()}
          batchSize={1}
          emptyGalleryText={'There are no photos or video'}
          maximumSelectedFiles={3}
          selected={this.state.selected}
          itemsPerRow={3}
          imageMargin={3}
          customLoader={this.renderLoader()}
          callback={this.getSelectedFiles.bind(this)} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  marker:{
    width: 30,
    height: 30,
    zIndex: 2445,
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
  },
  markerWrapper: {
    position: 'absolute',
    flex:1,
    top: 0 ,
    zIndex: 2445,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

```

### Todos

 - add more options 
 - add filter buttons
 - add overlay on videos with duration

License
----

MIT
