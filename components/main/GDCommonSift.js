
import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Switch,
  Image,
  Dimensions,
  ListView,
  Platform
} from 'react-native';

var {width,height} = Dimensions.get('window');

export default class GDCommonSift extends Component {

  static defaultProps = {
    onRemovedModal: {},
    loadSiftData: {},
  };

  static propTypes = {
    isShowSiftMune: PropTypes.bool,
    data: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
        dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>{r1!=r2}})
    };
  }

  closeModal(state) {
    this.props.onRemovedModal(state);
  }

  //处理接收到的数据
  componentDidMount() {

    let data = [];

    for (let i = 0; i < this.props.data.length; i++) {
      data.push(this.props.data[i]);
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })
  }

  loadSiftData(rowData) {
    this.closeModal(false);
    this.props.loadSiftData(rowData.mall,rowData.cate);
  }

  _renderRow(rowData) {
    return (
      <View style={{backgroundColor:'white'}}>
        <TouchableOpacity onPress={()=>{this.loadSiftData(rowData)}}>
          <View style={Styles.itemViewStyle}>
            <Image source={{uri:rowData.image}} style={Styles.itemImageStyle} />
            <Text >{rowData.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <TouchableOpacity onPress={()=>{this.closeModal(false)}} activeOpacity={1}>
        <View style={Styles.container}>
          {/* 九宫格 */}
          <ListView
            scrollEnabled={false}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            contentContainerStyle={Styles.contentViewStyle}
            initialListSize={16}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  contentViewStyle:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width,
    marginTop: Platform.OS === 'ios' ? 64 : 44
  },
  itemViewStyle:{
    width: width*0.25,
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemImageStyle:{
    width: 40,
    height: 40
  }
})
