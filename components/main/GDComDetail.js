
import React,{Component, PropTypes} from 'react';

import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  WebView,
  View,
  DeviceEventEmitter
} from 'react-native';

import GDCommonNav from '../main/GDCommonNavBar';
import Global from '../main/Global';


export default class GDComDetail extends Component {

  static propTypes = {
    url:PropTypes.string.isRequired,
    title:PropTypes.string,
  };

  backup() {
    //反向传值
    alert(Global.username);
    if(this.props.callback){
      this.props.callback();
    }
    this.props.navigator.pop();
  }

  //接收通知，隐藏TabBar
  componentWillMount() {
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',true);
  }
  componentWillUnmount() {
    this._isMounded = false;
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',false);
  }

  renderLeftItem() {
    return (
      <TouchableOpacity onPress={() => {this.backup()}}>
        <Image source={{uri:'back'}} style={Styles.navBarLeftStyle}></Image>
      </TouchableOpacity>
    )
  }
  renderTitleItem() {
    return (
      <Text style={Styles.navBarTitleStyle}>{this.props.title}</Text>
    )
  }
  rendderRightItem() {
    return <Text style={Styles.navBarRightStyle}> </Text>;
  }

  render() {
    return (
      <View style={Styles.container}>
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTitleItem()}
          rightItem = {() => this.rendderRightItem()}
        />
        <WebView
          style={Styles.webViewStyle}
          source={{url:this.props.url,method:'GET'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
        />
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    flex:1
  },
  webViewStyle:{
    flex:1
  },
  navBarLeftStyle:{
    width: 20,
    height: 20,
    marginLeft: 15
  },
  navBarRightStyle:{
    width: 20,
    height: 20,
    marginRight: 15
  },
  navBarTitleStyle:{
    width: 200,
    textAlign: 'center',
    height: 20,
    fontSize: 17.0
  }
})
