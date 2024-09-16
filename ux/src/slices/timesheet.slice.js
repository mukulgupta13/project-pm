import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import urls from "../constants/urls";

 const timesheetSlice = createSlice({
    name: 'timesheet',
    initialState: {
        timesheets: [],
        currentTimesheet: {},
    },
    reducers: {
        updateTimesheets: (state, payload) => {
            state.timesheets = payload.timesheets;
        },
        setCurrentTimesheet: (state, { payload }) => {
            state.currentTimesheet = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTimesheets.fulfilled, (state, { payload }) => {
            state.timesheets = payload;
        });
        builder.addCase(fetchTimesheet.fulfilled, (state, { payload }) => {
            state.currentTimesheet = payload;
        });
        builder.addCase(saveTimesheet.fulfilled, (state, { payload }) => {
            const ix = state.timesheets.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.timesheets.splice(ix, 1, payload);
            } else {
                state.timesheets.push(payload);
            }
        });
        builder.addCase(updateTimesheet.fulfilled, (state, { payload }) => {
            const ix = state.timesheets.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.timesheets.splice(ix, 1, payload);
            } else {
                state.timesheets.push(payload);
            }
        });
        builder.addCase(deleteTimesheet.fulfilled, (state, { payload }) => {
            const ix = state.timesheets.findIndex(x => x._id === payload.id);
            if (ix !== -1) {
                state.timesheets.splice(ix, 1);
            }
        });

    },
});

export const fetchTimesheets = createAsyncThunk('timesheet/list', async () => {
    const response = await axios.get(urls.Timesheets.Common);
    return response.data.data;
});

export const fetchTimesheet = createAsyncThunk('timesheet/byid', async (id) => {
    const response = await axios.get(urls.Timesheets.Common + '/' + id);
    return response.data.data;
});

export const saveTimesheet = createAsyncThunk('timesheet/save', async (data) => {
    const response = await axios.post(urls.Timesheets.Common, data);
    return response.data.data;
});

export const updateTimesheet = createAsyncThunk('timesheet/update', async (data) => {
    const response = await axios.put(urls.Timesheets.Common + `/${data.id}`, data.data);
    return response.data.data;
});

export const deleteTimesheet = createAsyncThunk('timesheet/delete', async (id) => {
    const response = await axios.delete(urls.Timesheets.Common + `/${id}`);
    return { ...response.data, id};
});

export const { updateTimesheets, setCurrentTimesheet } = timesheetSlice.actions

export default timesheetSlice.reducer;
