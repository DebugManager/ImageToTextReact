
import axios from "axios";

const GET_ALL_COMPANIES = process.env.GET_ALL_COMPANIES || 'http://157.230.50.75:8000/v1/company/';
const CREATE_NEW_COMPANY = process.env.CREATE_NEW_COMPANY || 'http://157.230.50.75:8000/v1/company/';
const EDIT_COMPANY = process.env.EDIT_COMPANY || 'http://157.230.50.75:8000/v1/company/'

export const getAllCompanies = async () => {
    try {
        const response = await axios.get(`${GET_ALL_COMPANIES}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const searchCompanies = async (name: string) => {
    try {
        const response = await axios.get(`${GET_ALL_COMPANIES}?search=${name}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getCompanyById = async (id: number) => {
    try {
        const response = await axios.get(`${GET_ALL_COMPANIES}${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createNewCompany = async (name: string) => {
    try {
        const data = {
            name: name
        }
        const response = await axios.post(`${CREATE_NEW_COMPANY}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const editCompany = async (name: string, id: number) => {
    try {
        const data = {
            name: name
        }
        const response = await axios.post(`${EDIT_COMPANY}${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteCompany = async (id: number) => {
    try {
        const response = await axios.delete(`${CREATE_NEW_COMPANY}${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}