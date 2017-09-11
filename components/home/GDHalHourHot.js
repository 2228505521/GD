
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ListView,
  DeviceEventEmitter,
} from 'react-native';

const {width ,height} = Dimensions.get('window');

//第三方框架
import TabNavigator from 'react-native-tab-navigator';
import {PullList} from 'react-native-pull';

//引入外部应用
import GDCommonNav from '../main/GDCommonNavBar';
import CommonHotCell from '../main/GDCommonHotCell';
import NoDataView from '../main/GDNoDataView';
import GDDetail from '../main/GDComDetail';

export default class GDHalHourHot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged:(oldRow,newRow) => oldRow !== newRow}),
      loaded: false,
    };
    //将此网络请求绑定到本页面
    this.fetchData = this.fetchData.bind(this);
  }

  static defaultProps = {
    onRemovedModal: {}
  }

  //网络请求
  fetchData(resolve) {

    setTimeout(()=>{

      let params = {"count":20};
      HTTPRequest.post('http://guangdiu.com/api/gethots.php',params)
      .then((responseData) => {
        if (this._isMounded) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            loaded: true,
          })
        }
        if (resolve !== undefined){
          resolve();
        }
      })
      .catch((error) => {

      })
    },3000)
  }

  backUp(data) {
    //导航返回
    // this.props.navigator.pop();
    //模态返回
    this.props.onRemovedModal(data);
  }

  pushToDetail(data){
    this.props.navigator.push({
      component: GDDetail,
      passProps: {
        url:'https://guangdiu.com/api/showdetail.php'+'?'+'id='+data.id,
        title: data.title,
      }
    })
  }

  //接收通知，隐藏TabBar
  componentWillMount() {
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',true);
  }
  //耗时操作放在此处
  componentDidMount() {
    this._isMounded = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounded = false;
    this.subscription = DeviceEventEmitter.emit('hiddenTabBar',false);
  }

  //返回cell样式
  rednerRow(rowData) {
    return (
      <TouchableOpacity onPress={()=>this.pushToDetail(rowData)}>
        <CommonHotCell
          image={rowData.image}
          title={rowData.title}
        />
      </TouchableOpacity>
    )
  }
  renderSeparator(sectionID:number,rowID:number) {
    return (
      <View style={{height:0.5,backgroundColor:'#cccccc',marginLeft:15}} key={rowID}></View>
    );
  }
  renderTableHeader() {
    return (
      <View style={styles.headerTitleTip}>
        <Text>根据每条折扣的点击进行统计，每五分钟更新一次</Text>
      </View>
    )
  }

  renderLeftItem() {
    return (
      <Text style={styles.leftNavBarStyle}>  </Text>
    )
  }
  renderTitleItem() {
    return (
      <Text style={styles.titleNavBarStyle}>近半小时热门</Text>
    )
  }
  renderRightItem() {
    return (
      <TouchableOpacity onPress={() => this.backUp(false)}>
        <Text style={styles.rightNavBarStyle}>关闭</Text>
      </TouchableOpacity>
    )
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
            renderHeader = {this.renderTableHeader}
          />
        )
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <GDCommonNav
          leftItem = {() => this.renderLeftItem()}
          titleItem = {() => this.renderTitleItem()}
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
  headerTitleTip: {
    height: 35,
    width: width,
    backgroundColor: 'rgba(239,239,239,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftNavBarStyle: {
    marginLeft: 15,
    width: 20,
    height: 20
  },
  titleNavBarStyle: {
    fontSize: 17.0,
    color: 'black',
    height: 20,
    alignItems: 'center'
  },
  rightNavBarStyle: {
    height: 20,
    color: 'rgb(121,195,120)',
    fontSize: 17.0,
    marginRight: 15,
    textAlign: 'center',
    paddingTop: 2
  },
  ListViewStyle: {
    width: width,
  }
});
