import axios from "axios";

const GET_USER_BY_ID = process.env.GET_USER_BY_ID || 'https://pdf-to-txt-back.onrender.com/v1'

export const getUserById = async (id: string | number) => {
    try {
        const response = await axios.get(`${GET_USER_BY_ID}/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
