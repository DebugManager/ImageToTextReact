import axios from 'axios';

const EDIT_AFFILIATE = 'http://157.230.50.75:8000/v1/edit-affiliate/';

interface IAffiliate {
  first_name: string;
  last_name: string;
  email: string;
  password: number;
  promotion_plan: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  facebook: string;
  paypal_email: string;
  btc_adress: string;
}

export const createAffiliate = async (data: IAffiliate, user_id: number) => {
  const newData = {
    ...data,
    user_id: user_id,
  };
  try {
    const response = await axios.post(`${EDIT_AFFILIATE}`, newData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
