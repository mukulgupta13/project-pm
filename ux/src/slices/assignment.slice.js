import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import urls from "../constants/urls";

export const assignmentSlice = createSlice({
    name: 'assignment',
    initialState: {
        assignments: [],
        currentAssignment: {},
    },
    reducers: {
        updateAssignments: (state, payload) => {
            state.assignments = payload.assignments;
        },
        setCurrentAssignment: (state, payload) => {
            state.currentAssignment = payload.assignment;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAssignments.fulfilled, (state, { payload }) => {
            state.assignments = payload;
        })
    },
});

export const fetchAssignments = createAsyncThunk('assignments/list', async () => {
    const response = await axios.get(urls.Assignments.GetAll);
    return response.data.data;
});

export const { updateAssignments, setCurrentAssignment } = assignmentSlice.actions

export default assignmentSlice.reducer;
