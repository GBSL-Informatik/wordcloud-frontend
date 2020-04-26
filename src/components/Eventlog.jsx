import React from "react";

export default class Eventlog extends React.Component {
  render() {
    return (
      <div className="word-log">
        <table>
          <thead>
            <tr>
              <th>Created At</th>
              <th>Word</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.words.reverse().map((word, idx) => {
              return (
                <tr key={idx}>
                  <td>{word.created_at}</td>
                  <td>{word.word}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}
