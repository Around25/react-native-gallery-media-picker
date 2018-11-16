import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  base: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#626262'
  },
  thumb: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 8
  },
  textWrapper: {
    marginLeft: 10
  },
  name: {
    fontSize: 18,
    fontWeight: '500'
  },
  counter: {
    fontSize: 12
  },
  first: {
    borderTopWidth: 1,
    borderTopColor: '#626262'
  }
});
