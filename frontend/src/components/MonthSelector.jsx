import { useState } from 'react';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import monthList from'../helpers/monthList';

const MonthSelector = (props) => {
    const [month, setMonth] = useState(0);
    const handleChange = (e) => {
        setMonth(e.target.value);
        props?.passSelectedMonth(e.target.value);
    }

    return (
        <Box minWidth={120}>
            <FormControl fullWidth>
                <InputLabel id="month-selector">Month</InputLabel>
                <Select
                    labelId="month-selector"
                    id="month-selector"
                    value={month}
                    label="Month"
                    onChange={handleChange}
                    disabled={props?.isDisabled}
                >
                    <MenuItem value={0} key={0}>{monthList[0]}</MenuItem>
                    <MenuItem value={1} key={1}>{monthList[1]}</MenuItem>
                    <MenuItem value={2} key={2}>{monthList[2]}</MenuItem>
                    <MenuItem value={3} key={3}>{monthList[3]}</MenuItem>
                    <MenuItem value={4} key={4}>{monthList[4]}</MenuItem>
                    <MenuItem value={5} key={5}>{monthList[5]}</MenuItem>
                    <MenuItem value={6} key={6}>{monthList[6]}</MenuItem>
                    <MenuItem value={7} key={7}>{monthList[7]}</MenuItem>
                    <MenuItem value={8} key={8}>{monthList[8]}</MenuItem>
                    <MenuItem value={9} key={9}>{monthList[9]}</MenuItem>
                    <MenuItem value={10} key={10}>{monthList[10]}</MenuItem>
                    <MenuItem value={11} key={11}>{monthList[11]}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default MonthSelector;
