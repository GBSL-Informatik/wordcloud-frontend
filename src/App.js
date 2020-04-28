import React from "react";
import "./styles.css";
import axios from "axios";
import Wordcloud from "./components/Wordcloud";
import WordForm from "./components/WordForm";
import Eventlog from "./components/Eventlog";
import socketioClient from "socket.io-client";

export const API_URL = "http://localhost:4001";

/**
 * either use 'http' or 'socket'
 */
export const PROTOCOL = 'socket';

export default class App extends React.Component {
  state = {
    words: []
  };

  componentDidMount() {
    switch (PROTOCOL) {
      case 'http':
        this.loadWords();
        break;
      case 'socket':
        this.socket = socketioClient(API_URL);
        this.socket.on("word_data", data => this.setState({ words: data }));
        break;
      default:
        return;
    }
  }

  addWord = word => {
    if (word.word.length <= 1 || word.word.length > 16) {
      return;
    }
    switch (PROTOCOL) {
      case 'http':
        axios.post(`${API_URL}/words`, word).then(() => {
          this.loadWords();
        });
        break;
      case 'socket':
        this.socket.emit("add_word", word);
        break;
      default:
        return;
    }
  };

  loadWords() {
    axios
      .get(`${API_URL}/words`)
      .then(({ data }) => {
        this.setState({ words: data });
      })
      .catch(error => {
        console.log(error);
      });
  }


  render() {
    return (
      <div className="App">
        <h1>Wordcloud {PROTOCOL.toUpperCase()}
          {
            /* only show the refresh button when http-protocol is used */
            PROTOCOL === 'http' &&
            <button title="Refresh" onClick={() => this.loadWords()}>↻</button>
          }
        </h1>
        <Wordcloud words={this.state.words} />
        <WordForm addWord={this.addWord} />
        {
          /* only show the refresh button when http-protocol is used */
          PROTOCOL === 'socket' &&
          <button title="Clear" onClick={() => this.socket.emit('clear')}>🗑️</button>
        }
        <Eventlog words={this.state.words} />
      </div>
    );
  }
}
