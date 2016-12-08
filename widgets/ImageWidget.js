var React = require('react');
var {
  View,
  Image,
  TouchableHighlight,
  PixelRatio
} = require('react-native')

var WidgetMixin = require('../mixins/WidgetMixin.js');

module.exports = React.createClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'ImageWidget',
      source: '',
      onPress: () => {},
    };
  },

  render() {
    return (
      <View style={this.getStyle('imageRow')}>
        <TouchableHighlight
          onPress={() => {
            this.props.onPress();
          }}
          underlayColor={this.getStyle('underlayColor').pop()}
          {...this.props} // mainly for underlayColor
        >
          <Image
            style={this.getStyle('image')}
            source={this.props.source}
            />
        </TouchableHighlight>
      </View>
    );
  },

  defaultStyles: {
    imageRow: {
      backgroundColor: '#FFF',
      height: 120,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderColor: '#c8c7cc',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
    },
    image: {
      width: 100,
      height: 100,
      // fontSize: 15,
      // flex: 1,
    },
    underlayColor: '#c7c7cc',
  },

});
