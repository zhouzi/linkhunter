(function () {
    'use strict';

    var Link = React.createClass({
        render: function () {
            return (
                <li className="demo-link">
                    <div className="demo-link-group">
                        <a href={linkhunter.withProtocol(this.props.obj)}>{this.props.obj}</a>
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">linkhunter.withProtocol(link)</div>
                        {linkhunter.withProtocol(this.props.obj)}
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">linkhunter.shorten(link, 24)</div>
                        {linkhunter.shorten(this.props.obj, 24, true)}
                    </div>

                    <div className="demo-link-group">
                        <div className="demo-link-group__title">linkhunter.beautify(link)</div>
                        {linkhunter.beautify(this.props.obj)}
                    </div>
                </li>
            );
        }
    });

    var DemoApp = React.createClass({
        getInitialState: function () {
            var text = [
                'linkhunter\'s purpose is to match links such as gabinaureche.com/linkhunter, hello@gabinaureche.com and http://www.nytimes.com/interactive/2015/07/03/upshot/a-quick-puzzle-to-test-your-problem-solving.html?_r=1 from user input.',
                'Try to copy and paste urls and/or type some text in there to see it in action.'
            ].join(' ');

            return { text: text, links: linkhunter.getLinks(text, true) };
        },

        onChange: function () {
            var text = React.findDOMNode(this.refs.textarea).value;
            this.setState({ text: text, links: linkhunter.getLinks(text, true) });
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