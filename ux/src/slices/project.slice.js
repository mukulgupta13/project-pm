import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import urls from "../constants/urls";

export const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: [],
        currentProject: {},
    },
    reducers: {
        updateProjects: (state, payload) => {
            state.projects = payload.projects;
        },
        setCurrentProject: (state, { payload }) => {
            state.currentProject = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.fulfilled, (state, { payload }) => {
            state.projects = payload;
        });
        builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
            state.currentProject = payload;
        });
        builder.addCase(saveProject.fulfilled, (state, { payload }) => {
            const ix = state.projects.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.projects.splice(ix, 1, payload);
            } else {
                state.projects.push(payload);
            }
        });
        builder.addCase(updateProject.fulfilled, (state, { payload }) => {
            const ix = state.projects.findIndex(x => x._id === payload._id);
            if (ix !== -1) {
                state.projects.splice(ix, 1, payload);
            } else {
                state.projects.push(payload);
            }
        });
        builder.addCase(deleteProject.fulfilled, (state, { payload }) => {
            const ix = state.projects.findIndex(x => x._id === payload.id);
            if (ix !== -1) {
                state.projects.splice(ix, 1);
            }
        });

    },
});

export const fetchProjects = createAsyncThunk('projects/list', async () => {
    const response = await axios.get(urls.Projects.Common);
    return response.data.data;
});

export const fetchProject = createAsyncThunk('project/byid', async (id) => {
    const response = await axios.get(urls.Projects.Common + '/' + id);
    return response.data.data;
});

export const saveProject = createAsyncThunk('project/save', async (data) => {
    const response = await axios.post(urls.Projects.Common, data);
    return response.data.data;
});

export const updateProject = createAsyncThunk('project/update', async (data) => {
    const response = await axios.put(urls.Projects.Common + `/${data.id}`, data.data);
    return response.data.data;
});

export const deleteProject = createAsyncThunk('project/delete', async (id) => {
    const response = await axios.delete(urls.Projects.Common + `/${id}`);
    return { ...response.data, id};
});

export const { updateProjects, setCurrentProject } = projectSlice.actions

export default projectSlice.reducer;
