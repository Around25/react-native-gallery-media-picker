import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  wrapper:{
    flexGrow: 1,
    paddingRight: 0
  },
  loading: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row:{
    flexDirection: 'row',
    flex: 1,
  },
  marker: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'transparent',
  },
  emptyText: {
    textAlign: 'center'
  }
});
