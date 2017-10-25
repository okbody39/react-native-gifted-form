var React = require('react');


var {View, Text} = require('react-native')
var WidgetMixin = require('../mixins/WidgetMixin.js');


import Button from 'apsl-react-native-button';

var GiftedFormManager = require('../GiftedFormManager');


// @todo to test with validations
module.exports = React.createClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'ButtonWidget',
      onPress: () => {},
      isDisabled: false,
      activityIndicatorColor: 'black',
      };
  },

  propTypes: {
    onPress: React.PropTypes.func,
    isDisabled: React.PropTypes.bool,
    activityIndicatorColor: React.PropTypes.string,
  },

  getInitialState() {
    return {
      isLoading: false,
    };
  },

  clearValidationErrors() {
    this.props.form.setState({errors: []});
  },

  _doPress() {
    this.props.onPress();
  },

  render() {
    return (
      <View>
        <Button
          ref='submitButton'
          style={this.getStyle('submitButton')}
          textStyle={this.getStyle('textSubmitButton')}
          disabledStyle={this.getStyle('disabledSubmitButton')}

          isLoading={this.state.isLoading}
          isDisabled={this.props.isDisabled}
          activityIndicatorColor={this.props.activityIndicatorColor}

          {...this.props}

          onPress={() => this._doPress()}
        >
          {this.props.title}
        </Button>
      </View>
    );
  },

  defaultStyles: {
    submitButton: {
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: '#3498db',
      borderWidth: 0,
      borderRadius: 0,
      height: 40,
    },
    disabledSubmitButton: {
      opacity: 0.5,
    },
    textSubmitButton: {
      color: 'white',
      fontSize: 15,
    },
  },

});
