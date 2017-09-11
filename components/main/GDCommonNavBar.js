
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

export default class GDCommonNavBar extends Component {

  //初始化数据，使用PropsTypes
  static propTypes = {
    leftItem:PropTypes.func,
    titleItem:PropTypes.func,
    rightItem:PropTypes.func,
  };

  //左边
  renderLeftItem() {
    if (this.props.leftItem === undefined) return;
    return this.props.leftItem();
  }

  //中间
  renderTItleItem() {
    if (this.props.titleItem === undefined) return;
    return this.props.titleItem();
  }

  //右边
  renderRightItem() {
    if (this.props.rightItem === undefined) return;
    return this.props.rightItem();
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {/* 左边 */}
          {this.renderLeftItem()}
        </View>
        <View>
          {/* 中间 */}
          {this.renderTItleItem()}
        </View>
        <View>
          {/* 右边 */}
          {this.renderRightItem()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: Platform.OS === 'ios' ? 64 : 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingTop: 15
  },
});
