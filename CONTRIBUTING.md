## Contributing

1. [Install NodeJS](https://nodejs.org/download/)
2. Install gulp globally: `npm install --global gulp`
3. Install dev dependencies: `npm install`

### Gulp Tasks

* `gulp scripts`: Generate the distributed version.
* `gulp watch`: Watch and run the relevant tasks when a `.scss` or `.js` file change.
* `gulp test`: Run the tests.
* `gulp styles`: Generate the `styles.css` file from `styles.scss`.
* `gulp serve`: Serve the demo page, run `gulp watch` and reload on changes.
* `gulp`: Run the `scripts` and `styles` tasks.