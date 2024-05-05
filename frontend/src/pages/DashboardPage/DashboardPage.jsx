import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './DashboardPage.scss'
import monthList from "../../helpers/monthList";
import MonthSelector from "../../components/MonthSelector";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Loader from "../../components/Loader";
import Greeting from "../../components/Greeting";
import ExpenseCard from "../../components/ExpenseCard";
import Typography from '@mui/material/Typography';
import axios from "axios";

import { 
    Chart as ChartJS,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

import { Pie, Radar, PolarArea } from 'react-chartjs-2';
import CommonComponents from "../../components/CommonComponents";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3008;

const DashboardPage = () => {

    const [isOverviewMode, setOverviewMode] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [items, setItems] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('jwt_token');

    let location = useLocation();

    useEffect(() => {
        if(location?.state?.email){
            console.log(location.state.email);
            localStorage.setItem("currentUserEmail", location.state.email);
            setItems(location.state);
            setIsLoading(false);
        }
        else {
            const currentUserEmail = localStorage.getItem("currentUserEmail");
            const url = `${BASE_URL}:${SERVER_PORT}/api/v1/get-user-info`;
            const data = {
                email: currentUserEmail
            }
            axios({
                method: 'post',
                url,
                headers: {'Authorization': `Bearer ${token}`},
                data
            }).then((response) => {
                setItems(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                if(err.response.status === 404) {
                    console.log(err);
                    setIsLoading(false); 
                }
            });
        }
    }, []);

    const name = items?.name ? items.name : 'stranger';
    const monthlyExpenses = items?.months;

    ChartJS.register(
        ArcElement,
        Tooltip,
        Legend,
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler
    );

    //TODO: have a mode to show all the graphs

    const generateChart = (item, chartType) => {
        let labels = [];
        let data = [];
        for(let key in item?.expenses){
            labels.push(key);
            data.push(item?.expenses[key]);
        }
        console.log(labels, data)
        switch (chartType){
            case 'pie':
                let pieChartData = {
                    labels,
                    datasets: [
                        {
                        label: 'Money spent',
                        data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                        },
                    ],
                }
        
                return <Pie data={pieChartData} aria-label="pie-chart"/>;
            
            case 'radar':
                let radarData = {
                    labels,
                    datasets: [
                        {
                            label: 'Money spent',
                            data,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                    ],
                }
                return <Radar data={radarData} aria-label="radar-chart"/>;

            case 'polar':
                let polarData = {
                    labels,
                    datasets: [
                        {
                        label: 'Money spent',
                        data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                        ],
                        borderWidth: 1,
                        },
                    ],
                }
                return <PolarArea data={polarData} aria-label="polar-area-chart"/>;

            default:
                return <></>;
        }
    }

    // Overview mode
    const generateList = (item, index) => {
        const total = item?.total;
        const expenseDetails = {
            month: monthList[index],
            total,
            budget: item?.budget,
            expenses: item?.expenses
        }
        return (
            <ExpenseCard expenseDetails={expenseDetails} aria-label={`expense-card-${monthList[index]}`}/>
        );
      };

    console.log(items)
    return (
        <>
        <CommonComponents items={items}/>
        {isLoading ? <Loader isLoading/> :
        <>
        {/* <Navbar/> */}
        <div className="main-container">
            <div className="title-wrapper">
                <Greeting name={name}/>
                <div className="mode-switcher">
                    <FormLabel id="form-label" sx={{fontSize:'small'}} aria-label="select-view-mode">Select View Mode</FormLabel>
                    <RadioGroup
                        row
                        aria-label="mode-selector-radio-group"
                        name="row-radio-buttons-group"
                        value={isOverviewMode}
                        onChange={() => {setOverviewMode(!isOverviewMode)}}
                    >
                        <FormControlLabel value={true} control={<Radio />} label="Overview" aria-label="overview-mode"/>
                        <FormControlLabel value={false} control={<Radio />} label="Monthly" aria-label="monthly-mode"/>
                    </RadioGroup>
                </div>
            </div>
            
            {/* ***** Overview mode ***** */}

            {name!=="stranger" && isOverviewMode && (
                <>
                    <div>
                        Here are your expenses:
                    </div>
                    <div className="overview-wrapper">
                        {monthlyExpenses.map((item, index) => (
                            <div key={index} className={"month"+index}>
                                {generateList(item, index)}
                            </div>
                        ))}
                    </div>
                </>)
            }

            {/* ***** Individual mode ***** */}

            {name!=="stranger" && !isOverviewMode && (
                <>
                    <div className="month-selector">
                        <MonthSelector passSelectedMonth={setSelectedMonth} aria-label="month-selector"/>
                    </div>
                    <div className="monthly-report-wrapper">
                        <div className="budget-view">
                            <Typography aria-label="budget">
                                Budget: $ {monthlyExpenses[selectedMonth].budget}
                            </Typography>
                        </div>
                        <div className="total-spent">
                            <Typography aria-label="total-spent">
                                Total Spent: $ {monthlyExpenses[selectedMonth].total}
                            </Typography>
                        </div>
                        <div className="report" aria-label="overview-mode">
                            <Typography aria-label="expenditure-report">
                            Report: {monthlyExpenses[selectedMonth].total < monthlyExpenses[selectedMonth].budget || monthlyExpenses[selectedMonth].total === monthlyExpenses[selectedMonth].budget ?
                                <span style={{color:"green"}}>WITHIN BUDGET</span> :
                                <span style={{color:"red"}}>OVERSPENT</span>
                            }
                            </Typography>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <div className="chart0">
                            {generateChart(monthlyExpenses[selectedMonth], 'pie')}
                        </div>
                        <div className="chart1">
                            {generateChart(monthlyExpenses[selectedMonth], 'radar')}
                        </div>
                        <div className="chart2">
                            {generateChart(monthlyExpenses[selectedMonth], 'polar')}
                        </div>
                    </div>
                </>)
            }
        </div>
        </>}
        </>
    );
}

export default DashboardPage;
