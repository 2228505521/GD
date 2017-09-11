
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
import HalHourHot from '../home/GDHalHourHot';
import Search from '../home/Search';
import NoDataView from '../main/GDNoDataView';
import CommonHotCell from '../main/GDCommonHotCell';
import CommonCell from '../main/GDCommonCell';
import GDDetail from '../main/GDComDetail';
import Global from '../main/Global';
import Set from '../set/GDSet';

export default class GDHourList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged:(oldRow,newRow) => oldRow !== newRow}),
      loaded: false,
      prompt: '',
      activityAnimated: false,
      isNextClick: true
    };

    this.nextHourHour = '';
    this.nextHourDate = '';
    this.lastHourHour = '';
    this.lastHourDate = '';

    //加载更多初始化的数组
    this.data = [];

    //将此网络请求绑定到本页面
    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);

    Global.username = "程佳俊";
  }

  componentDidMount() {
    this.fetchData();
  }

  //网络请求使用post请求
  fetchData(resolve, date, hour) {
    this.setState({
      activityAnimated: true
    });
    setTimeout(() => {
      if(date){
        var params = {"date":date,"hour":hour};
      }
      HTTPRequest.get('http://guangdiu.com/api/getranklist.php',params)
      .then((responseData) => {

        //判断是否需要禁止下一小时操作
        let isNext = responseData.hasnexthour==='1'?true:false;

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          loaded: true,
          prompt: responseData.displaydate+responseData.rankhour+"点档"+"("+responseData.rankduring+")",
          activityAnimated: false,
          isNextClick: isNext
        });
        if(resolve !== undefined) {
          resolve();
        }

        this.nextHourHour = responseData.nexthourhour;
        this.nextHourDate = responseData.nexthourdate;
        this.lastHourHour = responseData.lasthourhour;
        this.lastHourDate = responseData.lasthourdate;

        //存储数组中最后一个元素的id
        let cnLastID = responseData.data[responseData.data.length - 1].id;
        AsyncStorage.setItem('cnLastID',cnLastID.toString());
        //存储数组中第一个数组的id
        let cnFirstID = responseData.data[0].id;
        AsyncStorage.setItem('cnFirstID',cnFirstID.toString());

        // //先清除本地存储数据
        // RealmBase.removeAllData('HomeData');
        // //存储数据————数据持久化
        // RealmBase.created('HomeData',responseData.data);
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
    let params = {"sinceid":value,"count":10};
    HTTPRequest.get('http://guangdiu.com/api/getlist.php',params)
    .then((responseData) => {
      this.data = this.data.concat(responseData.data);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.data),
        loaded: true,
      });
      //存储数组中最后一个元素的id
      let cnLastID = responseData.data[responseData.data.length - 1].id;
      AsyncStorage.setItem('hourLastID',cnLastID.toString());
    })
    .catch((error) => {
      alert(error);
    })
    .done();
  }

  loadMore() {
    AsyncStorage.getItem('hourLastID')
    .then((value) => {
      this.loadMoreData(value);
    })
  }

  lastHourFetch() {
    this.fetchData(undefined, this.lastHourDate, this.lastHourHour);
  }

  nextHourFetch() {
    this.fetchData(undefined, this.nextHourDate, this.nextHourHour);
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

  pushToSet() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.navigator.push({
        component:Set
      })
    })


    // let now = new Date();
    // let year = now.getFullYear();
    // let month = now.getMonth();
    // let day = now.getDate();
    //
    // if(month>=1 && month<=9){
    //   month = "0"+(month+1); //js中月份默认从0开始
    // }
    // if(day>=1 && day<=9){
    //   day = "0"+day;
    // }
    //
    // let currentDate = year + month + day;
    // alert(currentDate);
  }

  // 导航栏样式
  renderLeftItem() {
    return (
      <TouchableOpacity>
        <Image style={styles.leftNavBarStyle}></Image>
      </TouchableOpacity>
    );
  }
  renderTItleItem() {
    return (
      <TouchableOpacity>
        <Image source={{uri:'navtitle_rank_106x20'}} style={styles.titleNavBarStyle}></Image>
      </TouchableOpacity>
    );
  }
  renderRightItem() {
    return (
      <TouchableOpacity onPress={() => this.pushToSet()}>
        <Text style={styles.rightNavBarStyle}>设置</Text>
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
            // onPullRelease={(resolve) => this.fetchData(resolve)}
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

  render() {
    if (this.state.activityAnimated === true){
      return (
        <ActivityIndicator
          animating = {this.state.activityAnimated}
          style={{height: 80,flex:1,alignItems: 'center',backgroundColor:'rgba(0,0,0,0)'}}
          size="large"
        />
      )
    }
    return (
      <View style={styles.container}>
        {/* 导航栏样式 */}
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTItleItem()}
          rightItem = {() => this.renderRightItem()}
        />
        {/* 头部提醒栏 */}
        <View style={styles.headerViewStyle}>
          <Text>{this.state.prompt}</Text>
        </View>
        {/* 列表 */}
        {this.renderReloadListView()}
        {/* 切换按钮 */}
        <View style={styles.changeViewStyle}>
          <TouchableOpacity onPress={()=>{this.lastHourFetch()}}>
            <Text style={[styles.changeLeftTextStyle,styles.changeTextStyle]}>{"< "+"上一小时  "}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this.nextHourFetch()}}
            disabled={!this.state.isNextClick}
            >
            <Text style={{fontSize:17.0,color:this.state.isNextClick===true?'rgb(140,198,131)':'#cccccc'}}>{"  下一小时"+" >"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerViewStyle:{
    height: 35,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(251,251,251,1)'
  },
  ListViewStyle: {
    width: width,
    height: height
  },
  changeViewStyle:{
    height: 44,
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239,239,239,0.5)'
  },
  changeLeftTextStyle:{
    color:'rgb(140,198,131)',
  },
  changeTextStyle:{
    fontSize: 17.0,
    color:'rgb(140,198,131)',
  },
  changeRightTextStyle:{
    fontSize: 17.0,
    color:'#cccccc'
  },

  leftNavBarStyle: {
    marginLeft: 15,
    width: 20,
    height: 20,
  },
  titleNavBarStyle: {
    width: 106,
    height: 20,
    alignItems: 'center'
  },
  rightNavBarStyle: {
    width: 40,
    height: 20,
    color: 'rgb(121,195,120)',
    fontSize: 17.0,
    marginRight: 15,
    textAlign: 'center',
    paddingTop: 2
  },

});
