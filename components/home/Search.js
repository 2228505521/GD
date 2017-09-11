
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ListView,
  Dimensions,
  Modal,
  AsyncStorage,
  ActivityIndicator,
  TextInput
} from 'react-native';

const {width ,height} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');

//第三方框架
import TabNavigator from 'react-native-tab-navigator';
import { PullList } from 'react-native-pull';

//引入外部框架
import GDCommonNav from '../main/GDCommonNavBar';
import Search from '../home/Search';
import NoDataView from '../main/GDNoDataView';
import CommonCell from '../main/GDCommonCell';
import GDDetail from '../main/GDComDetail';
import Global from '../main/Global';

export default class GDHt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged:(oldRow,newRow) => oldRow !== newRow}),
      loaded: false,
    };
    //输入框输入数据
    this.inputText = '';

    //加载更多初始化的数组
    this.data = [];

    //将此网络请求绑定到本页面
    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);

  }

  backup() {
    dismissKeyboard();
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
  componentDidMount() {
    // this.fetchData();
  }

  //网络请求使用post请求
  fetchData(resolve,text) {
    setTimeout(() => {
      if (this.inputText === '')return;
      var params = {"q":this.inputText,"count":10};
      HTTPRequest.get('http://guangdiu.com/api/getresult.php',params)
      .then((responseData) => {
        if(responseData.data.length !== 0){
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            loaded: true,
          });
          if(resolve !== undefined) {
            resolve();
          }

          this.inputText = text;

          //存储数组中最后一个元素的id
          let cnLastID = responseData.data[responseData.data.length - 1].id;
          AsyncStorage.setItem('searchLastID',cnLastID.toString());

        }
        else{
          alert("没有获取到数据")
        }
      })
      .catch((error)=>{
        // //拿到本地存储的数据显示出来，如果没有数据则显示无数据页面
        // this.data = RealmBase.loadAll('HomeData');
        // alert(this.data);
        // this.setState({
        //   dataSource: this.state.dataSource.cloneWithRows(this.data),
        //   loaded: true,
        // });
      });
    }, 3000);
  }

  loadMoreData(value) {
    let params = {"sinceid":value,"q":this.inputText,"count":10};
    HTTPRequest.get('http://guangdiu.com/api/getresult.php',params)
    .then((responseData) => {
      this.data = this.data.concat(responseData.data);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data),
        loaded: true,
      });
      //存储数组中最后一个元素的id
      let cnLastID = responseData.data[responseData.data.length - 1].id;
      AsyncStorage.setItem('searchLastID',cnLastID.toString());
    })
    .catch((error) => {
      alert(error);
    })
    .done();
  }

  loadMore() {
    AsyncStorage.getItem('searchLastID')
    .then((value) => {
      this.loadMoreData(value);
    })
  }

  //跳转到详情页面
  pushToDetail(data) {
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
  }

  // 导航栏样式
  renderLeftItem() {
    return (
      <TouchableOpacity onPress={()=>this.backup()}>
        <View  style={styles.leftNavBarStyle}>
          <Image source={{uri:'back'}} style={styles.leftNavBarImageStyle}></Image>
          <Text style={{fontSize:15.0}}>首页</Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderTItleItem() {
    return (
      <TouchableOpacity>
        <View style={styles.navBarTitleStyle}>
          <Text style={{fontSize:17.0,textAlign: 'center',marginRight:20,fontWeight:'bold'}}>搜索</Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderRightItem() {
    return (
      <TouchableOpacity>
        <Image style={styles.navBarRightStyle}></Image>
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
          />
        )
      }
  }

  renderTextChange(text) {
    this.inputText = text === '' ? '' : text;
  }
  searchData(text) {
    this.fetchData(undefined, text);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 导航栏样式 */}
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTItleItem()}
          rightItem = {() => this.renderRightItem()}
        />
        {/* 搜索框 */}
        <View style={styles.headerViewStyle}>
          <View style={styles.inputViewStyle}>
            <Image source={{uri:'search_icon_20x20'}} style={styles.inputImageStyle} />
            <TextInput
              style={styles.textInputStyle}
              keyboardType='web-search'
              placeholder='请输入搜索关键字..'
              autoFocus={true}
              clearButtonMode='while-editing'
              onChangeText={(text)=>{this.renderTextChange(text)}}
              onSubmitEditing={(event)=>{this.searchData(event.nativeEvent.text)}}
            />
          </View>
          <TouchableOpacity onPress={()=>dismissKeyboard()}>
            <View style={styles.inputBtnStyle}>
              <Text style={{color:'rgb(140,198,131)',textAlign: 'center',}}>取消</Text>
            </View>
          </TouchableOpacity>
        </View>
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

  headerViewStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    height: 44,
    backgroundColor: 'white'
  },
  inputViewStyle:{
    flex: 0.8,
    backgroundColor: 'rgb(235,235,235)',
    marginLeft: 15,
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    borderRadius: 3
  },
  inputImageStyle:{
    width: 20,
    height: 20,
    marginLeft: 5,
    marginTop: 2,
    marginBottom: 2
  },
  textInputStyle:{
    marginLeft: 5,
    backgroundColor: '#66666600',
    flex: 1,
    fontSize: 13.0
  },
  inputBtnStyle:{
    flex: 0.2,
    marginRight:10,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
