
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform
} from 'react-native';

const {width ,height} = Dimensions.get('window');

export default class GDCommonHotCell extends Component {

  static propTypes = {
    image:PropTypes.string,
    title:PropTypes.string,
  };

  render() {
    return (
      <View style={styles.container}>
        {/* 左边 */}
        <Image source={{uri:this.props.image==='' ? 'defaullt_thumb_83x83' : this.props.image}} style={styles.imageStyle}/>
        {/* 中间 */}
        <View>
          <Text numberOfLines={3} style={styles.text} >{this.props.title}</Text>
        </View>
        {/* 右边 */}
        <Image source={{uri:'icon_cell_rightArrow'}}    style={styles.accessImageStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageStyle:{
    margin: 10,
    width: 70,
    height: 70,
  },
  accessImageStyle:{
    width: 10,
    height: 10,
    marginRight: 15
  },
  text:{
    width: width*0.65,
    fontSize: 14.0,
  }
});
