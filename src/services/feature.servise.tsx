
import axios from "axios";

const GET_ALL_FEATURES = process.env.GET_ALL_FEATURES || 'https://pdf-to-txt-back.onrender.com/v1/features/';
// const CREATE_NEW_FEATURE = process.env.CREATE_NEW_FEATURE || 'https://pdf-to-txt-back.onrender.com/v1/company/';
// const EDIT_COMPANY = process.env.EDIT_COMPANY || 'https://pdf-to-txt-back.onrender.com/v1/company/'

export const getAllFeatures = async (sortOption: string) => {
    try {
        const response = await axios.get(`${GET_ALL_FEATURES}?ordering=${sortOption}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const searchFeatures = async (name: string) => {
    try {
        const response = await axios.get(`${GET_ALL_FEATURES}?search=${name}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createNewFeature = async (data: any) => {
    try {
        const newData = {
            name: data.featureName
        }

        const response = await axios.post(`${GET_ALL_FEATURES}`, newData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const setVote = async (featureId: number, id: number) => {
    try {
        const data = {
            feature_id: featureId,
            user_id: id,
        }
        const response = await axios.post(`${GET_ALL_FEATURES}vote/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const setUnVote = async (featureId: number, id: number) => {
    try {
        const data = {
            feature_id: featureId,
            user_id: id,
        }
        const response = await axios.post(`${GET_ALL_FEATURES}unvote/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}