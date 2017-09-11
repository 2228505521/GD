
import React, { Component } from 'react';
import {Navigator} from 'react-native-deprecated-custom-components';
import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  AsyncStorage
} from 'react-native';

//第三方框架
import TabNavigator from 'react-native-tab-navigator';

//引用文件
import Home from '../home/GDhome';
import HourList from '../hourList/GDHourList';
import Ht from '../ht/GDHt';
import Request from '../main/HTTPRequest';
// import RealmStorage from '../storage/RealmStorage';


export default class GDMain extends Component {

  //ES6
  constructor(props) {
    super(props);
    //设置初始状态
    this.state = {
      selectedTab:"home",
      hiddenTabBar: false,
      cnbadgeText:'',
      usbadgeText:''
    };
  }

  //设置导航栏跳转动画
  setNavAnimatedType(route) {
    if(route.animationType !== undefined) {
      let conf = route.animationType;
      conf.gestures = null; //禁用手势gestures设置为null
      return conf
    }
    else{
      return Navigator.SceneConfigs.PushFromRight
    }
  }

  //点击item
  clickItem(selectedTab,subscriptName) {

    if (subscriptName !== '' && this.state.selectedTab === selectedTab) {
      //收到subscriptName开始发送通知
      DeviceEventEmitter.emit(subscriptName);
    }
    //渲染选中页面
    this.setState({ selectedTab: selectedTab });
  }

  //返回tabBarItem
  renderTabBarTtem(title,selectedTab,image,selectedImage,component,badgeText,subscriptName) {
    return(
      <TabNavigator.Item
        selected={this.state.selectedTab === selectedTab}
        title={title}
        badgeText={badgeText == 0 ? '' : badgeText}
        selectedTitleStyle={{color:"black"}}
        renderIcon={() => <Image source={{uri:image}} style={styles.tabBarIconImage}/>}
        renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabBarIconImage}/>}
        onPress={() => this.clickItem(selectedTab,subscriptName)}
        >
          <Navigator
            initialRoute={{name:selectedTab,component:component}}
            configureScene={(route) => this.setNavAnimatedType(route)}
            renderScene={(route, navigator)=>{
              var Component = route.component;
              return (
                <Component
                  navigator={navigator}
                  route={route}
                  //传值方法,通过...把passProps中的所有值全部传给下一页面
                  {...route.passProps}
                  loadDataNumber={()=>this.loadDataNumber()}
                />
              )
            }}
          />
      </TabNavigator.Item>
    );
  }

  //设置通知方法
  tongZhi(data) {
    this.setState({
      hiddenTabBar:data
    })
  }

  //加载tabBar上的数据
  loadDataNumber() {
    //取出记录最新消息的id
    // AsyncStorage.getItem('cnFirstID')
    // .then((value)=>{
    //   cnFirstID = parseInt(value);
    // });
    // AsyncStorage.getItem('usFirstID')
    // .then((value)=>{
    //   usFirstID = parseInt(value);
    // });

    //批量取出本地存储的id数据
    AsyncStorage.multiGet(['cnFirstID','usFirstID'],(error,stores)=>{
      var params = {
        "cnmaxid":stores[0][1],
        "usmaxid":stores[1][1]
      };
      //请求数据
      HTTPRequest.get("http://guangdiu.com/api/getnewitemcount.php",params)
      .then((responseData)=>{
        this.setState({
          cnbadgeText: responseData.cn,
          usbadgeText: responseData.us,
        })
      })
      .catch((error)=>{

      })
    });
  }

  //首页注册通知
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('hiddenTabBar',(data) => {this.tongZhi(data)});

    //设置定时器
    setInterval(()=>{
      this.loadDataNumber();
    },3000)
  }
  //组件销毁的时候注销通知
  componentWillUnMount() {
    this.subscription.remove();
  }

  render() {
    return (
      <TabNavigator
        tabBarStyle={this.state.hiddenTabBar !== true ? {} : {height:0,overflow:'hidden'}}
        sceneStyle={this.state.hiddenTabBar !== true ? {} : {paddingBottom: 0}}
        >
        {/* 首页 */}
        {this.renderTabBarTtem("首页", "home", "tabbar_home_30x30", "tabbar_home_selected_30x30", Home, this.state.cnbadgeText,'clickHomeItem')}
        {/* 海淘 */}
        {this.renderTabBarTtem("海淘", "ht", "tabbar_abroad_30x30", "tabbar_abroad_selected_30x30", Ht, this.state.usbadgeText,'clickHTItem')}
        {/* 小时风云榜 */}
        {this.renderTabBarTtem("风云榜", "hourlist", "tabbar_rank_30x30", "tabbar_rank_selected_30x30", HourList)}
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabBarIconImage: {
    width: 20,
    height: 20
  }
});
