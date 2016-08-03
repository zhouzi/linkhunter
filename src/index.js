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
      <main className="wrapper drop-shadow">
        <section className="hero">
          <h1>linkhunter</h1>
          <h2>Detect links that real users actually type.</h2>

          <nav className="nav">
            <ul>
              <li>
                <a href="https://github.com/Zhouzi/LinkHunter" className="button">
                  View on Github
                </a>
              </li>

              <li>
                <a href="https://twitter.com/home?status=linkhunter%2C%20detect%20links%20that%20real%20users%20actually%20type%20-%20http%3A%2F%2Fgabinaureche.com%2Flinkhunter%20via%20%40zh0uzi" target="_blank" className="button">
                  Tweet
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <section className="demo">
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
        </section>
      </main>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);