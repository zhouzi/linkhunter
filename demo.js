(function () {
    'use strict';

    var linkHunter = new LinkHunter();

    var Link = React.createClass({
        render: function () {
            return (
                <li className="demo-link">
                    <div className="demo-link-group">
                        <div className="demo-link-group__title">Link.original</div>
                        <a href={this.props.obj.withProtocol()}>{this.props.obj.original}</a>
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">Link.withProtocol()</div>
                        {this.props.obj.withProtocol()}
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">Link.shorten(24, true)</div>
                        {this.props.obj.shorten(24, true)}
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">Link.beautify()</div>
                        {this.props.obj.beautify(true)}
                    </div>
                </li>
            );
        }
    });

    var DemoApp = React.createClass({
        getInitialState: function () {
            var text = [
                //'LinkHunter\'s purpose if to match three type of links: emails such as someone@domain.com, urls in the form of http://gabinaureche.com/LinkHunter and finally user-typed urls like twitter.com.',
                'LinkHunter\'s purpose is to match links such as gabinaureche.com/LinkHunter, hello@gabinaureche.com and http://www.nytimes.com/interactive/2015/07/03/upshot/a-quick-puzzle-to-test-your-problem-solving.html?_r=1 from user input.',
                //'It\'s also able, among other things, to shorten, beautify and replace those links.',
                'Try to copy and paste urls and/or type some text in there to see it in action.'
            ].join(' ');

            return { text: text, links: linkHunter.getLinks(text, true) };
        },

        onChange: function () {
            var text = React.findDOMNode(this.refs.textarea).value;
            this.setState({ text: text, links: linkHunter.getLinks(text, true) });
        },

        render: function () {
            function createLink (link, index) {
                return (
                    <Link obj={link} key={index} />
                );
            }

            return (
                <div>
                    <div className="textarea">
                        <textarea rows="6" ref="textarea" onChange={this.onChange} defaultValue={this.state.text}></textarea>
                        <div className="textarea__footer">Found {this.state.links.length} link{this.state.links.length !== 1 ? 's' : ''}</div>
                    </div>

                    <ul className="demo-links">{this.state.links.map(createLink)}</ul>
                </div>
            );
        }
    });

    React.render(<DemoApp />, document.getElementById('app'));
})();