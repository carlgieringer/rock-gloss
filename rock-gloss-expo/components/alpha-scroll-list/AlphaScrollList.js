import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import debounce from 'lodash/debounce';

import AlphaScrollBar from './AlphaScrollBar';
import AlphaScrollIndicator from './AlphaScrollIndicator';

export default class AlphaScrollList extends Component {
  
  static propTypes = {
    Component: PropTypes.func,
    hideSideBar: PropTypes.bool,
    scrollKey: PropTypes.string,
    doReverse: PropTypes.bool,
    data: PropTypes.array,
    itemMeasurements: PropTypes.arrayOf(PropTypes.shape({
      height: PropTypes.number.isRequired,
      offset: PropTypes.number.isRequired,
    })),
    activeColor: PropTypes.string,
    scrollBarColor: PropTypes.string,
    scrollBarFontSizeMultiplier: PropTypes.number,
    onScrollEnds: PropTypes.func,
    onScrollStarts: PropTypes.func,
    scrollBarContainerStyle: PropTypes.object
  }

  static defaultProps = {
    hideSideBar: false,
    scrollKey: 'name',
    activeColor: '#52bad5',
    doReverse: false,
    itemHeight: 20,
    scrollBarFontSizeMultiplier: 1,
    onScrollEnds: () => { },
    onScrollStarts: () => { },
    scrollBarContainerStyle: { }
  }
  
  constructor(props) {
    super(props);

    this.state = {
      activeLetterViewTop: 0,
      activeLetter: undefined,
      isPortrait: this.isPortrait()
    };

    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
    this.scrollToOffset = this.scrollToOffset.bind(this);
    this.recordInteraction = this.recordInteraction.bind(this);
    this.flashScrollIndicators = this.flashScrollIndicators.bind(this);
  }

  //Forwarded flat list methods
  scrollToEnd (...params) {
    if (this.list)
      this.list.scrollToEnd(...params);
  }

  scrollToIndex (...params) {
    if (this.list)
      this.list.scrollToIndex(...params);
  }

  scrollToItem (...params) {
    if (this.list)
      this.list.scrollToItem(...params);
  }

  scrollToOffset (...params) {
    if (this.list)
      this.list.scrollToOffset(...params);
  }

  recordInteraction (...params) {
    if (this.list)
      this.list.recordInteraction(...params);
  }

  flashScrollIndicators (...params) {
    if (this.list)
      this.list.flashScrollIndicators(...params);
  }

  //Proper methods
  handleOnScroll (letter, activeLetterViewTop) {
    if (letter) {
      let index;

      if (this.state.activeLetter === undefined) {
        this.props.onScrollStarts();
      }

      this.setState({
        activeLetter: letter,
        activeLetterViewTop
      });

      if (letter === '#') {
        //it's a number or a symbol, scroll to the top or to the bottom of the list
        const firstIndex = 0;
        const lastIndex = this.props.data.length - 1;

        index = this.props.doReverse ? lastIndex : firstIndex;
      } else {
        //Get index of item with that letter and scroll to the first result on the list
        index = this.props.data.findIndex(item => item[this.props.scrollKey].charAt(0).localeCompare(letter) === 0);
      }

      if (index !== -1) {
        const offset = this.props.itemMeasurements[index]["offset"]
        this.list.scrollToOffset({ animated: false, offset });
      }
    }
  }

  handleOnScrollEnds () {
    this.setState({
      activeLetter: undefined,
      activeLetterViewTop: 0
    }, () => this.props.onScrollEnds());
  }

  isPortrait () {
    const { width, height } = Dimensions.get('window');

    return width < height;
  }

  handleOnLayout () {
    const isPortrait = this.isPortrait();

    if (isPortrait !== this.state.isPortrait)
      this.setState({
        isPortrait
      });
  }

  render () {
    const {
      Component,
      doReverse,
      activeColor,
      scrollBarColor,
      scrollBarContainerStyle,
      scrollBarFontSizeMultiplier,
      scrollBarPointerContainerStyle,
      ...rest
    } = this.props
    const {
      isPortrait,
      activeLetter,
      activeLetterViewTop,
    } = this.state
    return (
      <View onLayout={this.handleOnLayout.bind(this)}>
        <Component
          {...rest}
          ref={elem => this.list = elem}
        />
        {this.props.hideSideBar ? null : (
          <AlphaScrollBar
            isPortrait={isPortrait}
            doReverse={doReverse}
            activeColor={activeColor}
            fontColor={scrollBarColor}
            scrollBarContainerStyle={scrollBarContainerStyle}
            fontSizeMultiplier={scrollBarFontSizeMultiplier}
            onScroll={debounce(this.handleOnScroll.bind(this))}
            onScrollEnds={debounce(this.handleOnScrollEnds.bind(this))}
          />
        )}
        {this.state.activeLetter && !this.props.hideSideBar
          ? <AlphaScrollIndicator
            letter={activeLetter}
            color={activeColor}
            top={activeLetterViewTop}
            style={scrollBarPointerContainerStyle}
          />
          : null
        }
      </View>
    );
  }
}