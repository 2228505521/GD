
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ListView,
  Dimensions,
  Modal,
  AsyncStorage,
  ActivityIndicator,
  DeviceEventEmitter,
  InteractionManager
} from 'react-native';

const {width ,height} = Dimensions.get('window');

//第三方框架
import { Navigator } from 'react-native-deprecated-custom-components';
import TabNavigator from 'react-native-tab-navigator';
import { PullList } from 'react-native-pull';
import {GiftedListView} from 'react-native-gifted-listview';

//引入外部文件
import GDCommonNav from '../main/GDCommonNavBar';
import HalUSHourHot from '../home/GDUSHalHourHot';
import Search from '../home/Search';
import NoDataView from '../main/GDNoDataView';
import CommonHotCell from '../main/GDCommonHotCell';
import GDDetail from '../main/GDComDetail';
import Global from '../main/Global';
import CommonCell from '../main/GDCommonCell';
import SiftMenu from '../main/GDCommonSift';

import HtSiftData from '../data/HTSiftData';

export default class GDhome extends Component {

  static defaultProps = {
    loadDataNumber: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged:(oldRow,newRow) => oldRow !== newRow}),
      loaded: false,
      isShowHtModal: false,
      isShowSiftMune: false
    };

    //加载更多初始化的数组
    this.data = [];

    //将此网络请求绑定到本页面
    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);

    Global.username = "程佳俊";
  }

  componentDidMount() {
    this.fetchData();

    //订阅通知，用于通知到main函数中的数据监听
    this.subscription = DeviceEventEmitter.addListener('clickHTItem',()=>{
      this.clickTabBarItem();
    })
  }

  //网络请求使用post请求
  fetchData(resolve) {
    setTimeout(() => {
      let params = {
        "count":10,
        "country":"us",
      };
      HTTPRequest.get('http://guangdiu.com/api/getlist.php',params)
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          loaded: true,
        });
        if(resolve !== undefined) {
          resolve();
        }
        //获取最新数据的个数
        this.loadDataNumber();
        //存储数组中第一个数组的id
        let usFirstID = responseData.data[0].id;
        AsyncStorage.setItem('usFirstID',usFirstID.toString());
        //存储数组中最后一个元素的id
        let usLastID = responseData.data[responseData.data.length - 1].id;
        AsyncStorage.setItem('usLastID',usLastID.toString());
      });
    }, 3000);
  }

  fetchSiftData(mall, cate) {
    setTimeout(() => {
      let params;

      if (mall === '' && cate === '') {
        this.fetchData(undefined);
        return;
      }

      if (mall === '') {
        params = {
          "cate": cate,
          "country":"us",
        }
      }
      else{
        params = {
          "mall": mall,
          "country":"us",
        }
      }

      HTTPRequest.get('http://guangdiu.com/api/getlist.php',params)
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          loaded: true,
        });
        if(resolve !== undefined) {
          resolve();
        }
        this.data = [];

        //存储数组中最后一个元素的id
        let cnLastID = responseData.data[responseData.data.length - 1].id;
        AsyncStorage.setItem('cnLastID',cnLastID.toString());
      })
      .catch((error)=>{
      });
    }, 3000);
  }

  loadMoreData(value) {
    let params = {"sinceid":value,"count":10,"country":"us"};
    HTTPRequest.get('http://guangdiu.com/api/getlist.php',params)
    .then((responseData) => {
      this.data = this.data.concat(responseData.data);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data),
        loaded: true,
      });
      //存储数组中最后一个元素的id
      let usLastID = responseData.data[responseData.data.length - 1].id;
      AsyncStorage.setItem('usLastID',usLastID.toString());
      //存储数组中第一个数组的id
      let usFirstID = responseData.data[0].id;
      AsyncStorage.setItem('usFirstID',usFirstID.toString());
    })
    .catch((error) => {
      alert(error);
    })
    .done();
  }

  loadMore() {
    AsyncStorage.getItem('usLastID')
    .then((value) => {
      this.loadMoreData(value);
    })
  }

  loadDataNumber() {
    this.props.loadDataNumber();
  }

  //监听tab按钮的点击
  clickTabBarItem() {
    //实现一键置顶功能
    this.refs.pullList.scrollTo({y:0});
  }

  //跳转到近半小时热门
  pushToHalHourHat() {
    // return (
    //   //导航跳转
    //   // this.props.navigator.push({
    //   //   component:HalHourHot,
    //   //   animationType:Navigator.SceneConfigs.FloatFromBottom
    //   // })
    //   // 模态跳转
    // )
    this.setState({
      isShowHtModal: true,
      isShowSiftMune: true
    })
  }

  //跳转到搜索页面
  pushToSearch() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.navigator.push({
        component:Search,
      })
    })
  }

  //跳转到详情页面
  pushToDetail(data) {
    InteractionManager.runAfterInteractions(()=>{
      this.props.navigator.push({
      component:GDDetail,
      passProps: {
        url: 'https://guangdiu.com/api/showdetail.php'+'?'+'id='+data.id,
        title: data.title,
        callback:(data) => {
          this.setState({
            loaded:true,
          })
        }
      }
    })
    })
  }

  onRequestClose() {
    this.setState({
      isShowHtModal: false,
      isShowSiftMune: false
    })
  }

  closeModal(data) {
    this.setState({
      isShowHtModal: data,
      isShowSiftMune: data
    })
  }

  showSiftMenu() {
    this.setState({
      isShowSiftMune:true
    })
  }

  // 导航栏样式
  renderLeftItem() {
    return (
      <TouchableOpacity onPress={() => this.pushToHalHourHat()}>
        <Image source={{uri:'hot_icon_20x20'}} style={styles.navBarLeftStyle}></Image>
      </TouchableOpacity>
    );
  }
  renderTItleItem() {
    return (
      <TouchableOpacity onPress={() => this.showSiftMenu()}>
        <Image source={{uri:'navtitle_home_down_66x20'}} style={styles.navBarTitleStyle}></Image>
      </TouchableOpacity>
    );
  }
  renderRightItem() {
    return (
      <TouchableOpacity onPress={() => this.pushToSearch()}>
        <Image source={{uri:'search_icon_20x20'}} style={styles.navBarRightStyle}></Image>
      </TouchableOpacity>
    );
  }

  //返回cell样式
  rednerRow(rowData) {
    return (
      <TouchableOpacity onPress={() => this.pushToDetail(rowData)}>
        <CommonCell
          image={rowData.image}
          title={rowData.title}
          mall={rowData.mall}
          time={rowData.pubtime}
          from={rowData.fromsite}
        />
      </TouchableOpacity>
    )
  }
  renderSeparator(sectionID:number,rowID:number) {
    return (
      <View style={{height:0.5,backgroundColor:'#cccccc',marginLeft:15}} key={rowID}></View>
    );
  }
  renderFooter() {
    return (
        <View style={{height: 49, flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator />
            <Text style={{color:'gray',fontSize:12.0,marginLeft:10}}>loading more..</Text>
        </View>
    );
  }

  renderReloadListView() {
      if (this.state.loaded === false){
        return <NoDataView />
      }
      else{
        return (
          <PullList
            onPullRelease={(resolve) => this.fetchData(resolve)}
            style={styles.ListViewStyle}
            dataSource = {this.state.dataSource}
            renderRow = {this.rednerRow.bind(this)}
            initialListSize = {10}
            renderSeparator = {this.renderSeparator}
            onEndReached = {this.loadMore}
            onEndReachedThreshold = {60}
            renderFooter = {this.renderFooter}
            enableEmptySections = {true}
          />
        )
      }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 初始化半小时热门 */}
        <Modal
          animationType = 'slide' //跳转方式
          transparent = {false}   //透明度
          visible = {this.state.isShowHtModal}  //是否可见，通过点击控制
          onRequestClose = {() => this.onRequestClose()} //安卓端必须要实现
          >
            <Navigator
              initialRoute = {{name:"HalUSHourHot",component:HalUSHourHot}}
              renderScene = {(route,navigator)=>{
                let Component = route.component;
                return (
                  <Component
                    onRemovedModal = {(data) => this.closeModal(data)}
                    navigator={navigator}
                    //传值方法,通过...把passProps中的所有值全部传给下一页面
                    {...route.passProps}
                  />
                )
              }}
            />
          </Modal>
          {/* 初始化海淘 */}
          <Modal
            animationType = 'none' //跳转方式
            transparent = {true}   //透明度
            visible = {this.state.isShowSiftMune}  //是否可见，通过点击控制
            onRequestClose = {() => this.onRequestClose()} //安卓端必须要实现
            >
              <SiftMenu
                onRemovedModal = {(data) => this.closeModal(data)}
                data = {HtSiftData}
                loadSiftData = {(mall,cate)=>{this.fetchSiftData(mall, cate)}}
              />
            </Modal>
        {/* 导航栏样式 */}
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTItleItem()}
          rightItem = {() => this.renderRightItem()}
        />
        {/* 列表 */}
        {this.renderReloadListView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  navBarLeftStyle: {
    width: 20,
    height: 20,
    marginLeft: 15
  },
  navBarTitleStyle: {
    width: 66,
    height: 20,
  },
  navBarRightStyle: {
    width: 20,
    height: 20,
    marginRight: 15
  },
  ListViewStyle: {
    width: width,
  }
});
