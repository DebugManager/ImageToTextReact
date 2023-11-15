import axios from 'axios';

const CREATE_NOTIFICATION = 'http://157.230.50.75:8000/v1/notification/';
const MARK_AS_READED = 'http://157.230.50.75:8000/v1/mark-as-readed/';

interface IMarkAsReader {
  user_id: string | number;
  notification_id: string | number;
}

export const getNotification = async () => {
  try {
    const response = await axios.get(`${CREATE_NOTIFICATION}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createNotification = async (message: string) => {
  const data = {
    text: message,
  };
  try {
    const response = await axios.post(`${CREATE_NOTIFICATION}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const markAsReader = async (data: IMarkAsReader) => {
  try {
    const response = await axios.post(`${MARK_AS_READED}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
