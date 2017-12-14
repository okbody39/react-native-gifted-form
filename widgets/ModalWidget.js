import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Navigator,
  Image,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';

var WidgetMixin = require('../mixins/WidgetMixin');

var GiftedFormManager = require('../GiftedFormManager');
var TimerMixin = require('react-timer-mixin');

var moment = require('moment');

module.exports = React.createClass({
  mixins: [TimerMixin, WidgetMixin],

  getDefaultProps() {
    return {
      type: 'ModalWidget',
      scrollEnabled: true,
      disclosure: true,
      cancelable: false,
      displayValue: '',
      onClose: () => {},
      onCancel: () => {},
    };
  },

  propTypes: {
    type: React.PropTypes.string,
    scrollEnabled: React.PropTypes.bool,
    disclosure: React.PropTypes.bool,
    cancelable: React.PropTypes.bool,
    displayValue: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onCancel: React.PropTypes.func
  },

  getInitialState() {

    return {
      // @todo
      // should be an object with all status
      // childrenAreValid: {},
    };
  },

  renderDisclosure() {
    if (this.props.disclosure === true) {
      return (
        <Image
          style={this.getStyle('disclosure')}
          resizeMode={Image.resizeMode.contain}
          source={require('../icons/disclosure.png')}
        />
      );
    }
    return null;
  },

  onPress() {

    // title={this.props.title} // @todo working  ?

    var _self = this;

    var {
      GiftedFormModal
    } = require('../GiftedForm.js');


    var route = {
      onClose: _self.onClose,
      onCancel: _self.onCancel,
      renderScene(navigator) {
        // not passing onFocus/onBlur of the current scene to the new scene
        var {onFocus, onBlur, ...others} = _self.props;

        return (
          <GiftedFormModal
            {...others}

            navigator={navigator}
            isModal={true}
            children={_self._childrenWithProps}
          />
        );
      },
      getTitle() {
        return _self.props.title || '';
      },
      configureScene() {
        var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
        // disable pop gesture
        sceneConfig.gestures = {};
        return sceneConfig;
      },
      renderLeftButton(navigator) {
        if (_self.props.cancelable === true) {
          return (
            <TouchableOpacity
              onPress={() => {
                _self.requestAnimationFrame(() => {
                  _self.onClose(null, navigator);
                });
              }}
            >
              <Image
                style={{
                  width: 21,
                  marginLeft: 10,
                  tintColor: '#097881',
                }}
                resizeMode={Image.resizeMode.contain}
                source={require('../icons/close.png')}
              />
            </TouchableOpacity>
          );
        }
        return null;
      },
      renderRightButton(navigator) {
        // @todo other solution than onBack ? maybe do something automatically when scene get focus
        // @todo move button style to themes
        return (
          <TouchableOpacity
            onPress={() => {
              _self.requestAnimationFrame(() => {
                _self.onClose(null, navigator);
              });
            }}
          >
            <Image
              style={{
                width: 21,
                marginRight: 10,
                tintColor: '#097881',
              }}
              resizeMode={Image.resizeMode.contain}
              source={require('../icons/check.png')}
            />
          </TouchableOpacity>
        );
      },
    };

    // console.log('this.props.openModal from modal widget');
    // console.log(typeof this.props.openModal);

    if (this.props.openModal === null) {
      console.warn('GiftedForm: openModal prop is missing in GiftedForm component');
    } else {
      this.props.openModal(route);
    }
  },

  componentWillUpdate() {

    // if(this.props.displayValue === "fullName") {
    //   console.log("........componentWillUpdate : " + this.state.value);
    //   console.log("........componentWillUpdate-_getDisplayableValue : " + this._getDisplayableValue());
    // }

    this.oldValue = ( this.state.value == null ? this._getDisplayableValue() : this.state.value );

    // if(this.props.displayValue === "fullName") {
    //   console.log("........this.oldValue : " + this.oldValue);
    // }

  },

  componentWillMount() {
    this._childrenWithProps = React.Children.map(this.props.children, (child) => {

      return React.cloneElement(child, {
        formStyles: this.props.formStyles,
        openModal: this.props.openModal,
        formName: this.props.formName,
        navigator: this.props.navigator,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur,
        onValidation: this.props.onValidation,
        onValueChange: this.props.onValueChange,

        onClose: this.onClose,
        onCancel: this.onCancel,
      });
    });
  },

  componentDidMount() {
    this.setState({
      value: this._getDisplayableValue(),
    });
  },

  onCancel() {

    var v = this.props.displayValue;
    var w = null;

    if (Array.isArray(this.props.children)) {
      this.props.children.forEach(function (child, index, array) {

        if (child.props.name === v) {
          //console.log(child);
          w = child.type.defaultProps.type;
        }

      });
    } else {
      if(this.props.children.props.name === v) {
        w = this.props.children.type.defaultProps.type;
      }
    }

    this.setState({
      value: this.oldValue,
    });

    if(w === "TextInputWidget") {
      GiftedFormManager.stores[this.props.formName].values[this.props.displayValue] = this.oldValue;
    }

    //console.log("onCancel : "+this.state.value);

  },

  onClose(value, navigator = null) {

    if (typeof value === 'string') {
      this.setState({
        value: value,
      });
    } else if (this.props.displayValue !== '') {
      this.setState({
        value: this._getDisplayableValue(true),
      });
    }

    // console.log("this._getDisplayableValue() : "+this._getDisplayableValue());
    setTimeout((value, navigator) => {
      // console.log("ModalWidget updateValue : ", this.props.formName, this.props.displayValue, this.state.value, this._getDisplayableValue());
      GiftedFormManager.updateValue(this.props.formName, this.props.displayValue, this.state.value);

    }, 100);




    if (navigator !== null) {
      navigator.pop();
    }

    this.props.onClose && this.props.onClose();
  },

  refreshDisplayableValue() {
    this.setState({
      value: this._getDisplayableValue(),
    });
  },

  _getDisplayableValue(isClose) {

    if(isClose) {

      var vv = GiftedFormManager.getValues(this.props.formName);

      if(Array.isArray(vv[this.props.displayValue])) {
        return vv[this.props.displayValue].join(', ');
      }

      //console.log("TTTTTTTTT : " + this.props.displayValue)
      //console.log(GiftedFormManager.stores[this.props.formName]);
      //console.log("TTTTTTTTT : " + GiftedFormManager.stores[this.props.formName].values[this.props.displayValue]);
      // console.log("==============================");
      //
      // console.log("GiftedFormManager.getValues: ", vv[this.props.displayValue]);
      // console.log("GiftedFormManager.stores[this.props.formName].values[this.props.displayValue]: ", GiftedFormManager.stores[this.props.formName].values[this.props.displayValue]);
      // console.log("==============================");
    }



    if (this.props.displayValue !== '') {
      if (typeof GiftedFormManager.stores[this.props.formName] !== 'undefined') {
        if (typeof GiftedFormManager.stores[this.props.formName].values !== 'undefined') {
          if (typeof GiftedFormManager.stores[this.props.formName].values[this.props.displayValue] !== 'undefined') {
            if (typeof this.props.transformValue === 'function') {
              return this.props.transformValue(GiftedFormManager.stores[this.props.formName].values[this.props.displayValue]);
            } else if (GiftedFormManager.stores[this.props.formName].values[this.props.displayValue] instanceof Date) {
              return moment(GiftedFormManager.stores[this.props.formName].values[this.props.displayValue]).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd'
              });
            }
            if (typeof GiftedFormManager.stores[this.props.formName].values[this.props.displayValue] === 'string') {
              return GiftedFormManager.stores[this.props.formName].values[this.props.displayValue].trim();
            } else if (Array.isArray(GiftedFormManager.stores[this.props.formName].values[this.props.displayValue])) {
              var values = GiftedFormManager.getValues(this.props.formName);

              //console.log("Modal", values[this.props.displayValue]);
              // vals.map((v) => {
              //   console.log(this.props.displayValue, v);
              //   // if()
              //   // return v;
              // });

              return values[this.props.displayValue].join(', ');
            }
          } else {
            // @todo merge with when not select menu

            // when values[this.props.displayValue] is not found
            // probably because it's a select menu
            // options of select menus are stored using the syntax name{value}, name{value}
            var values = GiftedFormManager.getValues(this.props.formName);
            if (typeof values === 'object') {
              if (typeof values[this.props.displayValue] !== 'undefined') {
                if (typeof this.props.transformValue === 'function') {
                  return this.props.transformValue(values[this.props.displayValue]);
                } else {
                  if (Array.isArray(values[this.props.displayValue])) {
                    // @todo
                    // should return the title and not the value in case of select menu
                    //console.log("Modal#2", values[this.props.displayValue]);
                    return values[this.props.displayValue].join(', ');
                  } else if (values[this.props.displayValue] instanceof Date) {
                    return moment(values[this.props.displayValue]).calendar(null, {
                      sameDay: '[Today]',
                      nextDay: '[Tomorrow]',
                      nextWeek: 'dddd',
                      lastDay: '[Yesterday]',
                      lastWeek: '[Last] dddd'
                    });
                  } else {
                    //console.log("Modal#3", values[this.props.displayValue]);
                    return values[this.props.displayValue];
                  }
                }
              }
            }
          }
        }
      }
    }
    return '';
  },

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.requestAnimationFrame(() => {
            this.onPress();
          });
        }}
        underlayColor={this.getStyle('underlayColor').pop()}

        {...this.props} // mainly for underlayColor

        style={this.getStyle('rowContainer')}
      >
        <View style={this.getStyle('row')}>
          {this._renderImage()}
          <Text numberOfLines={1} style={this.getStyle('modalTitle')}>{this.props.title}</Text>
          <View style={this.getStyle('alignRight')}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[this.getStyle('modalValue'),{marginRight: this.props.disclosure ? 10 : 15,}]}>{this.state.value}</Text>
          </View>
          {this.renderDisclosure()}
        </View>
      </TouchableHighlight>
    );
  },

  defaultStyles: {
    rowImage: {
      height: 20,
      width: 20,
      marginLeft: 10,
    },
    rowContainer: {
      backgroundColor: '#FFF',
      borderBottomWidth: 1 / PixelRatio.get(),
      borderColor: '#c8c7cc',
    },
    underlayColor: '#c7c7cc',
    row: {
      flexDirection: 'row',
      height: 44,
      alignItems: 'center',
    },
    disclosure: {
      // transform: [{rotate: '90deg'}],
      //marginLeft: 10,
      marginRight: 10,
      width: 11,
    },
    modalTitle: {
      flex: 1,
      fontSize: 15,
      color: '#000',
      paddingLeft: 10,
    },
    alignRight: {
      alignItems: 'flex-end',
      width: 250,
      // marginRight: 10,
    },
    modalValue: {
      fontSize: 15,
      color: '#c7c7cc',
    },
  },
});
