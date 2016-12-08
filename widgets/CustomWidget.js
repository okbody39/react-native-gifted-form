var React = require('react');
var {
  View,
  PixelRatio
} = require('react-native')

var WidgetMixin = require('../mixins/WidgetMixin.js');

module.exports = React.createClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'CustomWidget',
      //height: 120,
      render: <View/>,
      // onPress: () => {},
    };
  },

  render() {
    return (
      <View style={this.getStyle('rowStyle')}>
        {this.props.render}
      </View>
    );
  },

  defaultStyles: {
    rowStyle: {
      backgroundColor: '#FFF',
      //height: this.props.height,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderColor: '#c8c7cc',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
    },
  },

});
