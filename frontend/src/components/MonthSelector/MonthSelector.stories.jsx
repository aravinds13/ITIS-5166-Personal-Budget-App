// MonthSelector.stories.jsx

import React from 'react';
import MonthSelector from './MonthSelector';

const logMonth = (value) => {
    console.log(value)
}

export default {
  title: 'Components/MonthSelector',
  component: MonthSelector,
};

export const Default = () => <MonthSelector passSelectedMonth={logMonth}/>;
export const Disabled = () => <MonthSelector passSelectedMonth={logMonth} isDisabled={true}/>;
