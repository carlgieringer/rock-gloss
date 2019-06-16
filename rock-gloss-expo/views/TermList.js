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
        <View>
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

  componentWillReceiveProps(nextProps) {
    if (this.props.terms !== nextProps.terms) {
      this.setState({filteredTerms: nextProps.terms});
    }
  }

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
    const filteredTerms = this.props.terms.filter(term => {
      const termText = `${term.title.toUpperCase()} ${term.definition.toUpperCase()}`;
      return termText.indexOf(text.toUpperCase()) > -1;
    });

    this.setState({
      searchText: text,
      filteredTerms,
    });
  };

  _renderHeader = () => (
    <SearchBar
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
