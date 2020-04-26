import React from "react";
import moment from "moment";

export default class WordForm extends React.Component {
  state = {
    word: ''
  };


  addWord() {
    this.props.addWord({
      word: this.state.word,
      created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    });
  }

  render() {
    return (
      <div className="word-form">
        <label htmlFor="word">Add Word</label>
        <input
          id="word"
          autoFocus
          type="text"
          onChange={e => this.setState({ word: e.target.value })}
          minLength={2}
          maxLength={16}
        />
        <button onClick={() => this.addWord()}>Add</button>
      </div>
    );
  }
}
