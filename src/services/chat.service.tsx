import axios from "axios";

const CREATE_CHAT_URL = "http://157.230.50.75:8000/v1/create-room/";
const GET_CHAT_ROOM_BY_ID = "http://157.230.50.75:8000/v1/room/";
const GET_MESSAGES_FROM_CHAT = 'http://157.230.50.75:8000/v1/messages/'

export const createChat = async (name: string | number) => {
  try {
    const data = {
      name: name,
    };
    const response = await axios.post(`${CREATE_CHAT_URL}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getChatById = async (id: number) => {
  try {
    const response = await axios.get(`${GET_CHAT_ROOM_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMessagesFromChat = async (id: number) => {
    try {
      const response = await axios.get(`${GET_MESSAGES_FROM_CHAT}${id}/`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
