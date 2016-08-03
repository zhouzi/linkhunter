import './styles.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import linkhunter from 'linkhunter';

class App extends Component {
  state = {
    text: 'linkhunter\'s purpose is to match links such as gabinaureche.com/linkhunter, hello@gabinaureche.com and http://www.nytimes.com/interactive/2015/07/03/upshot/a-quick-puzzle-to-test-your-problem-solving.html?_r=1 from user input.'
  };

  render () {
    const links = linkhunter.getLinks(this.state.text);

    return (
      <div>
        <div className="textarea">
          <textarea
            rows="6"
            onChange={(event) => this.setState({ text: event.target.value })}
            value={this.state.text}
          />

          <div className="textarea__footer">
            Found {links.length} link{links.length !== 1 ? 's' : ''}
          </div>
        </div>

        <ul className="demo-links">
          {links.map((link, index) => (
            <li key={index} className="demo-link">
              <div className="demo-link-group">
                <a href={linkhunter.withProtocol(link)}>{link}</a>
              </div>

              <div className="demo-link-group">
                <div className="demo-link-group__title">
                  linkhunter.withProtocol(link)
                </div>

                {linkhunter.withProtocol(link)}
              </div>

              <div className="demo-link-group">
                <div className="demo-link-group__title">
                  linkhunter.beautify(link)
                </div>

                {linkhunter.beautify(link)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);