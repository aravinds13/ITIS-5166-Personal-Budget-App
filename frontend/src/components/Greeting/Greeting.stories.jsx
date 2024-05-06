// Greeting.stories.jsx

import React from 'react';
import Greeting from './Greeting';

let name = "Ross";

export default {
  title: 'Components/Greeting',
  component: Greeting,
};

export const Default = () => <Greeting name={name}/>;
