import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import urls from "../constants/urls";

export const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        employees: [],
        currentEmployee: {},
    },
    reducers: {
        updateEmployees: (state, payload) => {
            state.employees = payload.employees;
        },
        setCurrentEmployee: (state, { payload }) => {
            state.currentEmployee = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
            state.employees = payload;
        });
        builder.addCase(fetchEmployee.fulfilled, (state, { payload }) => {
            state.currentEmployee = payload;
        });
        builder.addCase(saveEmployee.fulfilled, (state, { payload }) => {
            const ix = state.employees.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.employees.splice(ix, 1, payload);
            } else {
                state.employees.push(payload);
            }
        });
        builder.addCase(updateEmployee.fulfilled, (state, { payload }) => {
            const ix = state.employees.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.employees.splice(ix, 1, payload);
            } else {
                state.employees.push(payload);
            }
        });
        builder.addCase(deleteEmployee.fulfilled, (state, { payload }) => {
            const ix = state.employees.findIndex(x => x._id === payload.id);
            if (ix !== -1) {
                state.employees.splice(ix, 1);
            }
        });

    },
});

export const fetchEmployees = createAsyncThunk('employees/list', async () => {
    const response = await axios.get(urls.Employees.Common);
    return response.data.data;
});

export const fetchEmployee = createAsyncThunk('employee/byid', async (id) => {
    const response = await axios.get(urls.Employees.Common + '/' + id);
    return response.data.data;
});

export const saveEmployee = createAsyncThunk('employee/save', async (data) => {
    const response = await axios.post(urls.Employees.Common, data);
    return response.data.data;
});

export const updateEmployee = createAsyncThunk('employee/update', async (data) => {
    const response = await axios.put(urls.Employees.Common + `/${data.id}`, data.data);
    return response.data.data;
});

export const deleteEmployee = createAsyncThunk('employee/delete', async (id) => {
    const response = await axios.delete(urls.Employees.Common + `/${id}`);
    return { ...response.data, id};
});

export const { updateEmployees, setCurrentEmployee } = employeeSlice.actions

export default employeeSlice.reducer;
