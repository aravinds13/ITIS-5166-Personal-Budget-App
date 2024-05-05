import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Greeting from "../../components/Greeting";
import MonthSelector from "../../components/MonthSelector";
import Loader from "../../components/Loader";
import CommonComponents from "../../components/CommonComponents";
import './ModifyDataPage.scss';
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3008;

const ModifyDataPage = () => {
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState(); //master copy of the items. Should NOT be changed
    const [updatedData, setUpdatedData] = useState(); //copy of items that can be updated. Should be reset when context changes
    const [dataChanged, setDataChanged] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [isModalOpen, setModelOpen] = useState(false);
    const [newExpenseName, setNewExpenseName] = useState("");
    const [newExpenseValue, setNewExpenseValue] = useState();
    const [updatedExpenseName, setUpdatedExpenseName] = useState("");
    const [updatedExpenseValue, setUpdatedExpenseValue] = useState();
    const [currentRow, setCurrentRow] = useState([null,null]);
    const [isEditBudget, setEditBudget] = useState(false);
    const [currentBudget, setCurrentBudget] = useState();

    const location = useLocation();
    const name = items?.name ? items.name : 'stranger';
    const token = localStorage.getItem('jwt_token');

    
    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (updatedData && updatedData.months && updatedData.months[selectedMonth]) {
            setCurrentBudget(updatedData.months[selectedMonth].budget);
        }
    }, [selectedMonth, updatedData]);

    const getUserData = () => {
        let currentUserEmail = location?.state?.email ? location.state.email : localStorage.getItem("currentUserEmail");
        
        localStorage.setItem("currentUserEmail", currentUserEmail);
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
            setCurrentBudget(response.data.months[selectedMonth].budget);
            setUpdatedData(response.data);
            setIsLoading(false);
        })
        .catch((err) => {
            if(err.response.status === 404) {
                console.log(err);
                setIsLoading(false); 
            }
        });
    }

    const updateUserData = (updatedUserData) => {
        const url = `${BASE_URL}:${SERVER_PORT}/api/v1/update-user-info`;
        const data = isEditBudget ? {...updatedUserData} : {...updatedData};
        axios({
            method: 'post',
            url,
            headers: {'Authorization': `Bearer ${token}`},
            data
        }).then((response) => {
            console.log(response.data);
            getUserData();
            setDataChanged(false);
            setEditMode(false);
            setEditBudget(false);
        })
        .catch((err) => {
            if(err.response.status === 404) {
                console.log(err);
                setIsLoading(false); 
            }
        });
    }
    
    const generateRows = (data, month) => {
        let rows = [];
        let expenses = data.months[month].expenses;
        let index = 0;
        console.log(items);
        Object.entries(expenses).forEach(([key, value]) => {
            rows.push({name: key, value: value, index})
            index+=1;
          });
        return(
            rows.map((row) => {
                console.log(row);
                return(
                    <TableRow
                        key={row.index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="center">$ {row.value}</TableCell>
                        <TableCell align="right">
                            <Button
                                id={"delete_"+row.index}
                                variant="outlined"
                                sx={{color:"red", marginRight:"5px"}}
                                disabled={isEditMode || isEditBudget}
                                onClick={() => handleDelete(rows, row.index)}
                                
                            >
                                <DeleteIcon />
                            </Button>
                            <Button
                                id={"edit_"+row.index}
                                variant="outlined"
                                sx={{color:"black"}}
                                disabled={isEditBudget}
                                onClick={() => onEditClick(rows, row.index)}
                            >
                                <EditIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                )
            })
        )
    }
    
    const handleDelete = (rows, rowIndex) => {
        let updatedExpenses = {};
        let updatedItems = JSON.parse(JSON.stringify(updatedData)); // Deep copy
    
        updatedItems.months[selectedMonth].total -= rows[rowIndex].value;
        
        rows.splice(rowIndex,1);
        rows.forEach((item) => {
            updatedExpenses[item.name] = item.value;
        })
        updatedItems.months[selectedMonth].expenses = updatedExpenses;
        setDataChanged(true);

        setUpdatedData(updatedItems);
    }

    const handleCancel = () => {
        let originalData = {...items}
        setCurrentBudget(originalData.months[selectedMonth].budget);
        setEditBudget(false);
        setDataChanged(false);
        setEditMode(false);
        setUpdatedData(originalData);
    }

    const handleSave = () => {
        if(isEditBudget){
            console.log("currentBudget",currentBudget)
            let updatedItems = JSON.parse(JSON.stringify(updatedData));
            updatedItems.months[selectedMonth].budget = Number(currentBudget);
            setUpdatedData(updatedItems);
            setIsLoading(false);
            updateUserData(updatedItems);
        }
        else{
            setIsLoading(false);
        updateUserData();
        }
        
    }

    const onEditClick = (row, rowItem) => {
        setEditMode(true);
        setCurrentRow([row,rowItem]);
        setUpdatedExpenseName(row[rowItem].name);
        setUpdatedExpenseValue(row[rowItem].value);
        setModelOpen(true)
    }

    const handleEdit = () => {
        let rows = currentRow[0];
        let rowIndex = currentRow[1];

        let updatedExpenses = {};
        let updatedItems = JSON.parse(JSON.stringify(updatedData)); // Deep copy
        let valueDifference = updatedExpenseValue - rows[rowIndex].value;
        let currentTotal = Number(updatedItems.months[selectedMonth].total);
        updatedItems.months[selectedMonth].total = currentTotal + Number(valueDifference);
        rows[rowIndex].name = updatedExpenseName;
        rows[rowIndex].value = updatedExpenseValue;
        
        rows.forEach((item) => {
            updatedExpenses[item.name] = item.value;
        })
        updatedItems.months[selectedMonth].expenses = updatedExpenses;
        setModelOpen(false);
        setDataChanged(true);
        setUpdatedData(updatedItems);
    }

    const handleAdd = () => {
        let updatedItems = JSON.parse(JSON.stringify(updatedData)); // Deep copy
        let currentTotal = Number(updatedItems.months[selectedMonth].total)
        updatedItems.months[selectedMonth].total = currentTotal + Number(newExpenseValue);
        updatedItems.months[selectedMonth].expenses[newExpenseName] = Number(newExpenseValue);

        setDataChanged(true);
        setNewExpenseName("");
        setNewExpenseValue();
        setUpdatedData(updatedItems);
        handleModalClose();
    }

    const handleModalClose = () => {
        setModelOpen(false);
        setEditMode(false);
        setUpdatedExpenseName("");
        setUpdatedExpenseValue(null);
        setNewExpenseName("");
        setNewExpenseValue(null);
    }

    return (
        <>
        <CommonComponents items={items}/>
        {isLoading ? <Loader isLoading/> :
        <>
            <div className="main-container">
                <Greeting name={name}/>
                <div className="month-budget-wrapper">
                    <div className="month-selector">
                        <MonthSelector passSelectedMonth={setSelectedMonth} isDisabled={dataChanged||isEditMode||isEditBudget}  aria-label="month-selector"/>
                    </div>
                    <div className="budget">
                        <TextField
                            label="Budget"
                            disabled={!isEditBudget}
                            value = {currentBudget}
                            onChange={(e) => setCurrentBudget(e.target.value)}
                            type="number"
                            aria-label="edit-budget"
                        />
                    </div>
                    <div className="budget-edit">
                        <Button
                            disabled={isEditMode || dataChanged}
                            onClick={() => setEditBudget(true)}
                            aria-label="edit-budget-button"
                        >
                            <EditIcon  aria-label="edit-icon"/>
                        </Button>
                    </div>
                </div>
                <Dialog
                    open={isModalOpen}
                    onClose={() => handleModalClose()}
                >
                    <DialogTitle>{isEditMode?'Edit':'Add'} expense</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="expense"
                        name="expense"
                        label="Expense Name"
                        aria-label="expense-name-textfield"
                        type="string"
                        minWidth
                        variant="standard"
                        sx={{marginRight:"20px"}}
                        value={isEditMode ? updatedExpenseName : newExpenseName}
                        onChange={(e) => isEditMode ? setUpdatedExpenseName(e.target.value) : setNewExpenseName(e.target.value)}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="value"
                        name="Value"
                        label="Value"
                        aria-label="expense-value-textfield"
                        type="number"
                        minWidth
                        variant="standard"
                        value={isEditMode ? updatedExpenseValue : newExpenseValue}
                        onChange={(e) => isEditMode ? setUpdatedExpenseValue(e.target.value) : setNewExpenseValue(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => handleModalClose()} aria-label="modal-close-button">Cancel</Button>
                    <Button onClick={() => isEditMode ? handleEdit() : handleAdd()}
                        disabled={isEditMode ? !(updatedExpenseName.trim().length!==0 && updatedExpenseValue)
                            : !(newExpenseName.trim().length!==0 && newExpenseValue)}
                        aria-label="modal-update-button">
                        {isEditMode?'Update':'Add'}
                    </Button>
                    </DialogActions>
                </Dialog>

                <div className="table-wrapper">
                    <div className="table">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="expense-table">
                                <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight:"bold"}} aria-label="expense-table-name-title">Name</TableCell>
                                    <TableCell sx={{fontWeight:"bold"}} align="center" aria-label="expense-table-expense-title">Expense</TableCell>
                                    <TableCell sx={{fontWeight:"bold"}}align="right" aria-label="expense-table-actions-title">Actions</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        generateRows(updatedData, selectedMonth)
                                    }
                                    <TableRow
                                        key="save"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{fontWeight:"bold"}} aria-label="expense-table-total">Total</TableCell>
                                        <TableCell sx={{fontWeight:"bold"}} align="center">$ {updatedData.months[selectedMonth].total}</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => setModelOpen(true)} disabled={isEditMode || isEditBudget} aria-label="add-button">Add</Button>
                                            <Button onClick={() => handleCancel()} aria-label="cancel-button">Cancel</Button>
                                            <Button onClick={() => handleSave()} disabled={!dataChanged && !isEditBudget} aria-label="save-button">Save</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>}
        </>
    );
}

export default ModifyDataPage;
