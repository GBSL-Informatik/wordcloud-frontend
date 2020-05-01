import React from "react";
import moment from "moment";

export default class WordForm extends React.Component {
  state = {
    word: ''
  };

  onKeyUp(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      this.addWord();
    }
  }

  addWord() {
    if (this.state.word.length > 1) {
      this.props.addWord({
        word: this.state.word,
        created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
      });
      this.setState({ word: '' })
    }
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
          value={this.state.word}
          onKeyUp={e => this.onKeyUp(e)}
          minLength={2}
          maxLength={16}
        />
        <button onClick={() => this.addWord()}>Add</button>
      </div>
    );
  }
}
