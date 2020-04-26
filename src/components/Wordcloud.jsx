import React from "react";
import ReactWordcloud from 'react-wordcloud';
import _ from 'lodash';

export default class Wordcloud extends React.Component {

  get wordClouds() {
    if (this.props.words.length === 0) {
      return [{text: 'WORD-CLOUD', value: 1 }];
    }
    // groupBy returns an object-literal with key-value pairs:
    // e.g. _.groupBy(['foo', 'bar', 'foo']) returns { foo: ['foo', 'foo'], bar: ['bar'] }
    const groups = _.groupBy(this.props.words.map(word => word.word));
    return Object.keys(groups).map((word) => ({ text: word, value: groups[word].length }));
  }

  render() {
    return (
      <div className="word-cloud">
        <ReactWordcloud words={this.wordClouds} options={{ deterministic: true, fontSizes: [10, 80] }} />
      </div>
    );
  }
}
