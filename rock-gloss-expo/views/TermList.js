import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Dimensions,
  FlatList, 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SearchBar
} from 'react-native-elements';
import AlphaScrollList from '../components/alpha-scroll-list/AlphaScrollList'
import ViewMeasurer from '../components/ViewMeasurer'

class TermItem extends React.PureComponent {
  
  _onPress = () => {
    if (this.props.onPressItem) {
      this.props.onPressItem(this.props.id);
    }
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.textContainer}>
          <Text style={styles.term} selectable={true}>
            <Text style={styles.termTitle}>{this.props.term.title}</Text>{'\n'}{'\n'}
            <Text style={styles.termDefinition}>{this.props.term.definition}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class TermList extends React.Component {
  static propTypes = {
    terms: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
    })),
  }
  static defaultProps = {
    terms: [],
  }
  
  constructor(props) {
    super(props)
    const viewsToMeasure = props.terms
      ? TermList.viewsToMeasureFromTerms(props.terms)
      : [];
    this.state = {
      filteredTerms: [],
      termMeasurements: null,
      searchText: '',
      selected: new Map(),
      viewsToMeasure,
    };
  }
  
  render() {

    const termList = this.state.termMeasurements ? (
      <AlphaScrollList
        Component={FlatList}
        scrollKey="title"
        data={this.state.filteredTerms}
        itemMeasurements={this.state.termMeasurements}
        extraData={this.state}
        keyExtractor={TermList._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderHeader()}
        getItemLayout={this.getItemLayout}
        style={styles.list}
      />
    ) : (
      <View style={styles.loadingIndicatorContainer}>
        <ActivityIndicator
          color="black"
          size="large"
          style={styles.loadingIndicator}
        />
      </View>
    )
    const viewMeasurer = this.state.termMeasurements ? null : (
      <ViewMeasurer
        viewsToMeasure={this.state.viewsToMeasure}
        onMeasured={this.onMeasured}
      />
    )
    return (
      <View style={styles.container}>
        {termList}
        {viewMeasurer}
      </View>
    );
  }

  static _keyExtractor = (item, index) => item.title;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _onSearchBarChangeText = text => {
    this.setState({
      searchText: text,
    });
  };

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change.
    // Note we need to store prevPropsList and prevFilterText to detect changes.
    if (
      props.terms !== state.prevPropsTerms ||
      state.prevSearchText !== state.searchText
    ) {
      return {
        prevPropsTerms: props.terms,
        prevSearchText: state.searchText,
        filteredTerms: props.terms.filter(term => {
          if (!state.searchText) return true
          const termText = `${term.title.toUpperCase()} ${term.definition.toUpperCase()}`;
          return termText.indexOf(state.searchText.toUpperCase()) > -1;
        }),
        viewsToMeasure: props.terms
          ? TermList.viewsToMeasureFromTerms(props.terms)
          : []
      };
    }
    return null;
  }

  _renderHeader = () => (
    <SearchBar
      containerStyle={styles.searchBarContainer}
      placeholder="Type Here..."
      value={this.state.searchText}
      lightTheme
      round
      onChangeText={text => this._onSearchBarChangeText(text)}
      autoCorrect={false}
    />
  );

  _renderItem = ({item}) => (
    <TermItem
      id={item.title}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      term={item}
    />
  );
  
  onMeasured = (viewsToMeasure, newMeasurements) => {
    if (viewsToMeasure !== this.state.viewsToMeasure) {
      return;
    }
    if (!this.props.terms) {
      return;
    }
    let offset = 0
    const termMeasurements = this.props.terms.map((term) => {
      const {height} = newMeasurements.get(TermList._keyExtractor(term));
      const termHeight = {
        height,
        offset,
      }
      offset += height
      return termHeight
    });
    this.setState({ termMeasurements });
  }
  
  static viewsToMeasureFromTerms(terms) {
    const viewsToMeasure = [];
    for (let term of terms) {
      viewsToMeasure.push({
        id: this._keyExtractor(term),
        component: TermItem,
        componentProps: {
          id: this._keyExtractor(term),
          term: term,
        }
      });
    }
    return viewsToMeasure;
  }

  getItemLayout = (data, index) => {
    if (!this.state.termMeasurements) return null
    const termMeasurement = this.state.termMeasurements[index]
    return {
      length: termMeasurement.height, 
      offset: termMeasurement.offset, 
      index,
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    // Keep the list full-width.  alignSelf: 'stretch', is also recommended, but wasn't working for me. https://stackoverflow.com/questions/33297367/100-width-in-react-native-flexbox
    width: Dimensions.get('window').width,
  },
  textContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchBarContainer: {
    paddingRight: 25,
    marginBottom: 15,
  },
  term: {
    marginBottom: 15,
  },
  termTitle: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
  termDefinition: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
  },
  loadingIndicator: {
    flex: 1,
  },
  loadingIndicatorContainer: {
    position: "absolute",
  },
  listHeader: {
    paddingRight: 15,
  }
});
