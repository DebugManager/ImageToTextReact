import axios from 'axios';
import { toast } from 'react-toastify';

import { removeUser, setUser } from './locastorage.service';

import { getUserById } from './user.service';

const myCustomStyles = {
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
};

const progressBarStyles = {
  background: '#556EE6',
};

const CustomCheckmark = () => <div style={{ color: '#556EE6' }}>✔</div>;

const CustomErrorIcon = () => <div style={{ color: 'red' }}>✘</div>;

interface IUser {
  current_plan: string | number | null;
  address_line1?: string;
  city?: string;
  zip_code?: string | number;
  country?: string | number;
}

const GET_PACKAGE_BY_ID = 'http://157.230.50.75:8000/v1/stripe/get-price/';
const GET_PRICING_PLANS =
  process.env.REACT_APP_API_URL || 'http://157.230.50.75:8000/v1/plan';
const BY_PACKAGE =
  process.env.BY_PACKAGE || 'http://157.230.50.75:8000/v1/choose-plan';
const GET_STRAPI_INSTANCE =
  'http://157.230.50.75:8000/v1/stripe/process-payment/';
const GET_PACKAGES_FROM_STRIPE =
  'http://157.230.50.75:8000/v1/stripe/get_config/';
const GET_PACKAGE_ON_HOLD =
  'http://157.230.50.75:8000/v1/stripe/process-onhold/';
const CANCEL_SUBSCRIPTION =
  'http://157.230.50.75:8000/v1/stripe/cancel-subscription/';
const GET_ALL_INVOCES = 'http://157.230.50.75:8000/v1/stripe/get-invoices/';
const GET_INVOICE_DETAIL =
  'http://157.230.50.75:8000/v1/stripe/get-invoice-detail/?invoice_id=';

export const getAllInvoces = async (
  sortOption: string | undefined,
  customerId: string,
  sortPackage?: string,
  status?: string,
  method?: string
) => {
  const data = {
    customer_id: customerId,
  };

  let queryString = `?sort=${sortOption}`;

  if (sortPackage) {
    queryString += `&package=${sortPackage}`;
  }

  if (status) {
    queryString += `&status=${status}`;
  }

  if (method) {
    queryString += `&method=${method}`;
  }

  const url = `${GET_ALL_INVOCES}${queryString}`;

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceDetails = async (invoiceId: string) => {
  try {
    const response = await axios.get(`${GET_INVOICE_DETAIL}${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPackages = async (type: string) => {
  try {
    const response = await axios.get(
      `${GET_PACKAGES_FROM_STRIPE}?interval=${type}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPricing = async (type: string) => {
  try {
    const response = await axios.get(`${GET_PRICING_PLANS}?interval=${type}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPricingById = async (id: string | number) => {
  try {
    const response = await axios.get(`${GET_PACKAGE_BY_ID}${id}/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getStripeInstance = async (
  id: string | number,
  choosenPlan: string,
  customerId: string,
  paymentMethodId: string,
  current_plan?: string
) => {
  const data = {
    token: id,
    price_id: choosenPlan,
    customer_id: customerId,
    payment_method_id: paymentMethodId,
    old_subscription_id: current_plan ? current_plan : null,
  };
  try {
    const response = await axios.post(
      `${GET_STRAPI_INSTANCE}`,
      JSON.stringify(data)
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const putAccountOnHold = async (
  price_id: string,
  customer_id: string,
  payment_method_id: string,
  old_subscription_id: string
) => {
  const data = {
    price_id: price_id,
    customer_id: customer_id,
    payment_method_id: payment_method_id,
    old_subscription_id: old_subscription_id,
  };

  try {
    const response = await axios.post(
      `${GET_PACKAGE_ON_HOLD}`,
      JSON.stringify(data)
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const cancelSubscription = async (
  customer_id: string,
  subscription_id: string
) => {
  const data = {
    customer_id: customer_id,
    subscription_id: subscription_id,
  };

  try {
    const response = await axios.post(`${CANCEL_SUBSCRIPTION}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const buyPackage = async (userData: IUser, userid: string | number) => {
  try {
    const response = await axios.put(`${BY_PACKAGE}/${userid}/`, userData);

    if (response.data) {
      const user = await getUserById(userid);
      if (user.id) {
        removeUser();
        setUser(user);
      }

      toast.success('The package has been processed successfully', {
        position: 'top-right',
        autoClose: 3000,
        className: 'my-custom-toast',
        style: myCustomStyles,
        progressClassName: 'my-custom-progress-bar',
        progressStyle: progressBarStyles,
        icon: <CustomCheckmark />,
      });

      return 'ok';
    }
  } catch (error) {
    console.error(error);
    toast.error('Oppps... Something goes wrong', {
      position: 'top-right',
      autoClose: 3000,
      className: 'my-custom-toast-error',
      style: myCustomStyles,
      progressClassName: 'my-custom-progress-bar',
      progressStyle: progressBarStyles,
      icon: <CustomErrorIcon />,
    });
    return 'error';
  }
};
