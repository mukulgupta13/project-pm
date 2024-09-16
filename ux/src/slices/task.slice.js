import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import urls from "../constants/urls";

export const taskSlice = createSlice({
    name: 'task',
    initialState: {
        tasks: [],
        currentTask: {},
    },
    reducers: {
        updateTasks: (state, payload) => {
            state.tasks = payload.tasks;
        },
        setCurrentTask: (state, { payload }) => {
            state.currentTask = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.fulfilled, (state, { payload }) => {
            state.tasks = payload;
        });
        builder.addCase(fetchTask.fulfilled, (state, { payload }) => {
            state.currentTask = payload;
        });
        builder.addCase(saveTask.fulfilled, (state, { payload }) => {
            const ix = state.tasks.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.tasks.splice(ix, 1, payload);
            } else {
                state.tasks.push(payload);
            }
        });
        builder.addCase(updateTask.fulfilled, (state, { payload }) => {
            const ix = state.tasks.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.tasks.splice(ix, 1, payload);
            } else {
                state.tasks.push(payload);
            }
        });
        builder.addCase(deleteTask.fulfilled, (state, { payload }) => {
            const ix = state.tasks.findIndex(x => x._id === payload.id);
            if (ix !== -1) {
                state.tasks.splice(ix, 1);
            }
        });

    },
});

export const fetchTasks = createAsyncThunk('tasks/list', async () => {
    const response = await axios.get(urls.Tasks.Common);
    return response.data.data;
});

export const fetchTask = createAsyncThunk('task/byid', async (id) => {
    const response = await axios.get(urls.Tasks.Common + '/' + id);
    return response.data.data;
});

export const saveTask = createAsyncThunk('task/save', async (data) => {
    const response = await axios.post(urls.Tasks.Common, data);
    return response.data.data;
});

export const updateTask = createAsyncThunk('task/update', async (data) => {
    const response = await axios.put(urls.Tasks.Common + `/${data.id}`, data.data);
    return response.data.data;
});

export const deleteTask = createAsyncThunk('task/delete', async (id) => {
    const response = await axios.delete(urls.Tasks.Common + `/${id}`);
    return { ...response.data, id};
});

export const { updateTasks, setCurrentTask } = taskSlice.actions

export default taskSlice.reducer;
