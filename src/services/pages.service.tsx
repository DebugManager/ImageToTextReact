import axios from 'axios';

const EDIT_AFFILIATE = 'http://157.230.50.75:8000/v1/support-posts/';
const GET_PAGE_BY_ID = 'http://157.230.50.75:8000/v1/support-posts/edit/';

export const getPages = async () => {
  try {
    const response = await axios.get(`${EDIT_AFFILIATE}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPageByID = async (id: string) => {
  try {
    const response = await axios.get(`${GET_PAGE_BY_ID}${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
