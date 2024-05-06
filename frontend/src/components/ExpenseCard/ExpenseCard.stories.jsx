// ExpenseCard.stories.jsx

import React from 'react';
import ExpenseCard from './ExpenseCard';

let commonExpenseDetails = {
    total: 100,
    budget: 200,
    month: "January"
}
let withExpenses={Netflix: 100, Coffee: 20};
let missingExpenses = {};

const detailsWithExpenses = {...commonExpenseDetails, expenses: withExpenses};
const detailsWithoutExpenses = {...commonExpenseDetails, expenses: missingExpenses};

export default {
  title: 'Components/ExpenseCard',
  component: ExpenseCard,
};

export const WithExpenses = () => <ExpenseCard expenseDetails={detailsWithExpenses}/>;

export const MissingExpenses = () => <ExpenseCard expenseDetails={detailsWithoutExpenses}/>;
