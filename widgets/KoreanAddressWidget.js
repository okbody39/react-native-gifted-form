var React = require('react');

var {
  View,
  Text,
  TextInput,
  ListView,
  StyleSheet,
  TouchableOpacity,
} = require('react-native')

const parseString = require('react-native-xml2js').parseString;
var WidgetMixin = require('../mixins/WidgetMixin.js');

const defaultStyles = {
  container: {
    flex: 1,
    // backgroundColor: '#fafafa',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  row: {
    // flex: 1,
    padding: 12,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    margin: 10,
    fontSize: 13,
    backgroundColor: 'fafafa',
  },
  textInputInline: {
    fontSize: 15,
    flex: 1,
    height: 40,// @todo should be changed if underlined
    marginTop: 2,
    backgroundColor: '#fafafa',
  },
};

module.exports = React.createClass({
  mixins: [WidgetMixin],

  propTypes: {
    //onSelect: React.PropTypes.function,
    placeholder: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      //onSelect: (value) => console.log(value),
      type: 'KoreanAddressWidget',
    };
  },

  getInitialState() {
    // const ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2
    // });
    return {
      //text: '',
      jsonData: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
  },

  componentDidMount() {


  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  componentWillUnmount() {
  },

  _handleOnPress(zipcode) {
    //console.log(zipcode);

    this.props.onSelect({latitude: zipcode.point.y, longitude: zipcode.point.x});

    this._handleChangeText(zipcode.address);
    //this.setState({value:zipcode.address});
  },

  _renderRow(zipcode, sectionID, rowID) {
    return (

      <TouchableOpacity onPress={this._handleOnPress.bind(this, zipcode) }>
        <Text style={defaultStyles.text}>
          {zipcode.address}
        </Text>
      </TouchableOpacity>

    );
  },
  _handleOnFocus() {

    //console.log("_handleOnFocus", this.state.value);

    //alert(this.state.value);

    // var url = "http://52.78.196.203:8080/v2/util/zipcode?text=" + this.state.value;
    //
    // fetch(url)
    //   .then(response => response.json())
    //   .then((responseJson) => {
    //     // console.log(responseJson);
    //     // console.log(responseJson.result.items);
    //     this.setState({ jsonData : responseJson.result.items });
    //   }).catch((err) => {
    //   console.log('fetch', err)
    // });

  },

  _handleChangeText(value) {

    this.setState({value: value});
    this._onChange(value);


    //var url = "http://52.78.196.203:8080/v2/util/zipcode?text="+value;
    var url = this.props.url+value;

    fetch(url)
      .then(response => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        // console.log(responseJson.result.items);
        this.setState({ jsonData : responseJson.result.items });
      }).catch((err) => {
        console.log('fetch', err)
      });



  },

  render() {

    const rows = this.state.dataSource.cloneWithRows(this.state.jsonData || []);

    return (
      <View
        style={defaultStyles.container}
      >
        <TextInput
          style={defaultStyles.textInputInline}
          //onFocus={this._handleOnFocus}
          onChangeText={this._handleChangeText}
          value={this.state.value}
          {...this.props}
        />

        <ListView
          style={{marginTop: 5}}
          dataSource={rows}
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={defaultStyles.separator} />}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  },
});
