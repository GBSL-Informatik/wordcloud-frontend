import React from "react";
import "./styles.css";
import axios from "axios";
import Wordcloud from "./components/Wordcloud";
import WordForm from "./components/WordForm";
import Eventlog from "./components/Eventlog";
import socketioClient from "socket.io-client";

export const API_URL = "http://localhost:4001";


export default class App extends React.Component {
  state = {
    words: [],
    protocol: 'socket' // either 'socket' or 'http'
  };

  componentDidMount() {
    this.configureProtocol();
  }

  configureProtocol() {
    switch (this.state.protocol) {
      case 'http':
        if (this.socket) {
          this.socket.disconnect();
          this.socket = undefined;
        }
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
    switch (this.state.protocol) {
      case 'http':

        // const xhr = new XMLHttpRequest();
        // xhr.open("POST", `${API_URL}/words`, true);
        // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // xhr.setRequestHeader("Accept-Encoding", "identity");
        // xhr.send(JSON.stringify(word));
        axios.post(`${API_URL}/words`, word);
        break;
      case 'socket':
        this.socket.emit("add_word", word);
        break;
      default:
        return;
    }
  };

  clearWords() {
    switch (this.state.protocol) {
      case 'http':
        axios
          .post(`${API_URL}/clear`)
          .then(() => {
            this.loadWords()
          });
        break;
      case 'socket':
        this.socket.emit("clear");
        break;
      default:
        break;
    }
  }

  toggleProtocol() {
    if (this.state.protocol === 'http') {
      this.setState({ protocol: 'socket' });
    } else {
      this.setState({ protocol: 'http' });
    }
  }

  loadWords() {
    switch (this.state.protocol) {
      case 'http':
        axios
          .get(`${API_URL}/words`)
          .then(({ data }) => {
            this.setState({ words: data });
          })
          .catch(error => {
            console.log(error);
          });
        break;
      case 'socket':
        this.socket.emit("get_words");
        break;
      default:
        break;
    }
  }


  render() {
    return (
      <div className="App">
        <h1>Wordcloud {this.state.protocol.toUpperCase()}</h1>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <h4 style={{ marginRight: '1em' }}>Refresh</h4>
            <button title="Refresh" onClick={() => this.loadWords()}>↻</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <h4 style={{ marginRight: '1em' }}>Protocol</h4>
            <button
              title="HTTP"
              className={this.state.protocol === 'http' ? 'active' : ''}
              onClick={() => this.setState({ protocol: 'http' })}>
              http
            </button>
            <button
              title="Socket"
              className={this.state.protocol === 'socket' ? 'active' : ''}
              onClick={() => this.setState({ protocol: 'socket' })}>
              webSockets
            </button>
          </div>
        </div>
        <div style={{ height: '2em' }}></div>

        <Wordcloud words={this.state.words} />
        <WordForm addWord={this.addWord} />
        <button title="Clear" onClick={() => this.clearWords()}>🗑️</button>
        <Eventlog words={this.state.words} />
      </div>
    );
  }
}
