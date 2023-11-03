import axios from "axios";

const GET_ALL_TICKETS = process.env.GET_ALL_TICKETS || 'http://157.230.50.75:8000/v1/support/tickets/';
export const getAllTickets = async (sortOption: string) => {
    try {
        const response = await axios.get(`${GET_ALL_TICKETS}?ordering=${sortOption}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const searchCTickets = async (name: string) => {
    try {
        const response = await axios.get(`${GET_ALL_TICKETS}?search=${name}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createNewTickets = async (data: FormData) => {
    try {
        const response = await axios.post(`${GET_ALL_TICKETS}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const closeTicket = async (id: number) => {
    try {
        const data = {
            status: 'Succes'
        }
        const response = await axios.patch(`${GET_ALL_TICKETS}${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
