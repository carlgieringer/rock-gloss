import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import invariant from 'invariant';
import _isEmpty from 'lodash/fp/isEmpty';
import _intersectionWith from 'lodash/fp/intersectionWith';
import _differenceWith from 'lodash/fp/differenceWith';
import _isEqual from 'lodash/fp/isEqual';

const measureBatchSize = 20;

export default class ViewMeasurer extends React.PureComponent {

  state = {
    currentlyMeasuring: null,
  };
  
  static propTypes = {
    viewsToMeasure: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      component: PropTypes.any.isRequired,
    })).isRequired,
    onMeasured: PropTypes.func.isRequired,
    minHeight: PropTypes.number,
  };

  currentMeasurements = new Map();
  nextMeasurements = null;
  leftToMeasure = new Set();
  leftInBatch = 0;

  componentDidMount() {
    this.resetInternalState(this.props.viewsToMeasure);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewsToMeasure !== this.props.viewsToMeasure) {
      this.resetInternalState(nextProps.viewsToMeasure);
    }
  }

  // resets this.leftToMeasure and this.nextMeasurements
  resetInternalState(nextViewsToMeasure) {
    this.leftToMeasure = new Set();
    const nextNextMeasurements = new Map();

    const newViewsToMeasure =
      _differenceWith(_isEqual)(nextViewsToMeasure)(this.props.viewsToMeasure);
    for (let viewToMeasure of newViewsToMeasure) {
      this.leftToMeasure.add(viewToMeasure);
    }
    
    this.totalToMeasure = this.leftToMeasure.size;

    const existingMeasurements = this.nextMeasurements || this.currentMeasurements;
    const existingViewsToMeasure =
      _intersectionWith(_isEqual)(nextViewsToMeasure)(this.props.viewsToMeasure);
    for (let viewsToMeasure of existingViewsToMeasure) {
      const { id } = viewsToMeasure;
      const measurement = existingMeasurements.get(id);
      if (measurement !== undefined) {
        nextNextMeasurements.set(id, measurement);
      } else {
        this.leftToMeasure.add(viewsToMeasure);
      }
    }

    this.nextMeasurements = nextNextMeasurements;
    if (this.leftToMeasure.size === 0) {
      this.done(nextViewsToMeasure);
    } else {
      this.newBatch();
    }
  }

  onLayout(
    viewToMeasure,
    event,
  ) {
    invariant(this.nextMeasurements, "nextMeasurements should be set");
    const height = this.props.minHeight !== undefined && this.props.minHeight !== null
      ? Math.max(event.nativeEvent.layout.height, this.props.minHeight)
      : event.nativeEvent.layout.height
    const width = this.props.minWidth !== undefined && this.props.minWidth !== null
      ? Math.max(event.nativeEvent.layout.width, this.props.minWidth)
      : event.nativeEvent.layout.width
    this.nextMeasurements.set(
      viewToMeasure.id,
      {height, width},
    );
    this.leftToMeasure.delete(viewToMeasure);
    this.leftInBatch--;
    this.updateProgress()
    if (this.leftToMeasure.size === 0) {
      this.done(this.props.viewsToMeasure);
    } else if (this.leftInBatch === 0) {
      this.newBatch();
    }
  }
  
  updateProgress() {
    if (this.props.onProgress) {
      const progress = this.totalToMeasure ? 
        (this.totalToMeasure - this.leftToMeasure.size) / this.totalToMeasure :
        1;
      this.props.onProgress(progress);
    }
  }

  done(viewsToMeasure) {
    invariant(this.leftToMeasure.size === 0, "should be 0 left to measure");
    invariant(this.leftInBatch === 0, "batch should be complete");
    invariant(this.nextMeasurements, "nextMeasurements should be set");
    this.currentMeasurements = this.nextMeasurements;
    this.nextMeasurements = null;
    this.props.onMeasured(
      viewsToMeasure,
      this.currentMeasurements,
    );
    this.setState({ currentlyMeasuring: null });
  }

  newBatch() {
    let newBatchSize = Math.min(measureBatchSize, this.leftToMeasure.size);
    this.leftInBatch = newBatchSize;
    const newCurrentlyMeasuring = new Set();
    const leftToMeasureIter = this.leftToMeasure.values();
    for (; newBatchSize > 0; newBatchSize--) {
      const value = leftToMeasureIter.next().value;
      invariant(value !== undefined && value !== null, "item should exist");
      newCurrentlyMeasuring.add(value);
    }
    this.setState({ currentlyMeasuring: newCurrentlyMeasuring });
  }

  render() {
    const set = this.state.currentlyMeasuring;
    if (_isEmpty(set)) {
      return null;
    }
    invariant(set, "should be set");
    const dummies = Array.from(set).map((viewMeasurement) => {
      return (
        <View
          onLayout={(event) => this.onLayout(viewMeasurement, event)}
          key={viewMeasurement.id}
          style={styles.container}
        >
          <viewMeasurement.component
            {...viewMeasurement.componentProps}
          />
        </View>
      );
    });
    return <View>{dummies}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    // Hide the measurer so that it doesn't interfere with other views
    opacity: 0,
  },
});
