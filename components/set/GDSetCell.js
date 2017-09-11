
import React, { Component,PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Dimensions
} from 'react-native';

var {width,height} = Dimensions.get('window');

export default class GDSetCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
    };
  }


  static propTypes = {
    title: PropTypes.string,
    isShowSwitch: PropTypes.bool,
  };

  renderRightItem() {
    let component;

    if (this.props.isShowSwitch) {//显示switch
      component = <Switch value={this.state.isOn} onValueChange={()=>{this.setState({isOn:!this.state.isOn})}}/>;
    }else {
      component = <Image style={Styles.rightImageStyle} source={{uri:'icon_cell_rightArrow'}}/>;
    }
    return component;
  }

  render() {
    return (
      <View style={Styles.container}>
        {/* 左边 */}
        <View>
          <Text>{this.props.title}</Text>
        </View>
        {/* 右边 */}
        <View>
          {this.renderRightItem()}
        </View>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    width: width,
    height: 44,
    borderBottomWidth: 0.5,
    borderColor: '#f5f5f5'
  },
  rightImageStyle:{
    width: 10,
    height: 10,
    marginRight: 15
  }
})
