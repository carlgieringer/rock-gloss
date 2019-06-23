import React from 'react';
import {
  FlatList, 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SearchBar
} from 'react-native-elements';

class TermItem extends React.PureComponent {
  
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
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
  state = {
    filteredTerms: [],
    searchText: '',
    selected: new Map(),
  };

  _keyExtractor = (item, index) => item.title;

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
      };
    }
    return null;
  }

  _renderHeader = () => (
    <SearchBar
      containerStyle={styles.searchBar}
      placeholder="Type Here..."
      value={this.state.searchText}
      lightTheme
      round
      onChangeText={text => this._onSearchBarChangeText(text)}
      autoCorrect={false}
      style={styles.searchBar}
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

  render() {
    return (
      <FlatList
        data={this.state.filteredTerms}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderHeader()}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchBar: {
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
});
