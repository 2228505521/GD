
import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} from 'react-native';

import GDCommonNav from '../main/GDCommonNavBar';
import SetCell from '../set/GDSetCell';

export default class GDSet extends Component {

  componentWillMount() {
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',true);
  }
  componentWillUnmount() {
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',false);
  }

  backup() {
    this.props.navigator.pop();
  }

  // 导航栏样式
  renderLeftItem() {
    return (
      <TouchableOpacity onPress={()=>this.backup()}>
        <View  style={Styles.leftNavBarStyle}>
          <Image source={{uri:'back'}} style={Styles.leftNavBarImageStyle}></Image>
          <Text style={{fontSize:15.0}}>返回</Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderTItleItem() {
    return (
      <TouchableOpacity>
        <View style={Styles.navBarTitleStyle}>
          <Text style={{fontSize:17.0,textAlign: 'center',marginRight:20,fontWeight:'bold'}}>设置</Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderRightItem() {
    return (
      <TouchableOpacity>
        <Image style={Styles.navBarRightStyle}></Image>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={Styles.container}>
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTItleItem()}
          rightItem = {() => this.renderRightItem()}
        />
        <ScrollView style={Styles.ScrollViewStyle}>
          <SetCell style={Styles.cell1Style} isShowSwitch={true} title='淘宝天猫快捷下单'/>
          <SetCell isShowSwitch={false} title='清除图片缓存'/>
        </ScrollView>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white'
  },

  leftNavBarStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftNavBarImageStyle: {
    width: 20,
    height: 20,
    marginLeft: 15
  },
  navBarTitleStyle: {
    height: 20,
    width: 100,
  },
  navBarRightStyle: {
    width: 20,
    height: 20,
    marginRight: 15
  },

  ScrollViewStyle: {
    backgroundColor:'white'
  },

  cell1Style:{
    borderBottomWidth: 1,
    borderColor: '#cccccc'
  }
})
