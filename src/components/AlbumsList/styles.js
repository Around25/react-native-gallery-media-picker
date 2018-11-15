import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  marker: {
    position: 'absolute',
    zIndex: 2445,
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    width: 25,
    height: 25
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    opacity: 0.5,
    backgroundColor: 'white',
  }
});
