
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

export default class GDCommonCell extends Component {

  static propTypes = {
    image:PropTypes.string,
    title:PropTypes.string,
    mall:PropTypes.string,
    time:PropTypes.string,
    from:PropTypes.string
  };

  renderDate(time,from){

    //时间差的计算
    let minute = 1000 * 60 //一分钟
    let hour = minute * 60 //一小时
    let day = hour * 24 //一天
    let week = day * 7 //周
    let month = week * 30 //月
    //计算时间差
    let current = new Date().getTime(); //获取当前时间
    let diffValue = current - Date.parse(time.replace(/-/gi,"/")); //获取时间戳的差值
    if(diffValue < 0){
      return;
    }else{
      let monthC = diffValue/month; //计算相差几个月
      let weekC = diffValue/week; // 计算相差几个星期
      let dayC = diffValue/day; // 计算相差几天
      let hourC = diffValue/hour; //计算相差几小时
      let minuteC = diffValue/minute; //相差几分钟

      let result;
      if(monthC >= 1){
        result = parseInt(monthC)+"月前";
      }else if (weekC >= 1) {
        result = parseInt(weekC)+"周前";
      }else if (dayC >= 1) {
        result = parseInt(dayC)+"天前";
      }else if (hourC >= 1) {
        result = parseInt(hourC)+"小时前";
      }else if (minuteC >= 1) {
        result = parseInt(minuteC)+"分钟前";
      }else{
        result = "刚刚";
      }

      return result + ' · ' + from;
    }

  }

  render() {
    return (
      <View style={styles.container}>
        {/* 左边 */}
        <Image source={{uri:this.props.image==='' ? 'defaullt_thumb_83x83' : this.props.image}} style={styles.imageStyle}/>
        {/* 中间 */}
        <View style={styles.centerViewStyle}>
          {/* 标题部分 */}
          <View>
            <Text numberOfLines={3} style={styles.text} >{this.props.title}</Text>
          </View>
          {/* 说明部分 */}
          <View style={styles.detailViewStyle}>
            {/* 平台 */}
            <Text style={styles.detailPingtaiStyle}>{this.props.mall}</Text>
            {/* 来源 */}
            <Text style={styles.detailFromStyle}>{this.renderDate(this.props.time,this.props.from)}</Text>
          </View>
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

  centerViewStyle:{
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  detailViewStyle:{
    marginBottom: 5,
    backgroundColor: "white",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailPingtaiStyle:{
    color: 'green',
    fontSize: 13.0,
  },
  detailFromStyle:{
    marginRight: 8,
    color: 'gray',
    fontSize: 13.0,
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
