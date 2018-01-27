import { configure } from '@storybook/react';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import '../src/style/main.styl';

const req = require.context('.', true, /\.stories\.js$/);

const loadStories = () => {
  req.keys().forEach((filename) => req(filename));
};

configure(loadStories, module);
