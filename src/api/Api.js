import axios from 'axios';

import {API_URL, GET_ETHER_ADDRESS, GET_TOKEN_LIST} from './Constants';
import NavigationService from '../config/nav/NavigationService';

let axiosConfig = (accessToken = '') => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    validateStatus: function(status) {
        return status < 500;
    },
  };
};

// 응답 인터셉터 추가
axios.interceptors.response.use(
  response => {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  error => {
    // 오류 응답을 처리
    if (error.response && error.response.status === 401) {
      NavigationService.navigate('IntroPage');
    }
    return Promise.reject(error);
  },
);

/**
 * Auth API ======================================================
 */

/**
 * /user/me
 * @param accessToken
 * @returns {Promise<T>}: {userInfo} / error: not found
 */
const validateAccessToken = accessToken => {
  try {
    return axios
      .get(API_URL + '/user/me', axiosConfig(accessToken))
      .then(response => {
        return response.data;
      });
    // return response.data;
  } catch (e) {
    console.log(e);
    return {invalidToken: true};
  }
};

/**
 * /auth/login
 * @param postData: {email: string, password: string}
 * @returns {Promise<T>}: {accessToken: string}
 */
const loginUser = async postData => {
  try {
    // console.log('accessToken : ', accessToken);
    // console.log('postData : ', postData);
    // console.log('response : ', response.data);
    const response = await axios.post(API_URL + '/auth/login', postData);
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * /auth/signup
 * @param postData: {email, password, name, phoneNumber}
 * @returns {Promise<T>}: {success: boolean, message: string}
 */
const signupUser = async postData => {
  try {
    console.log('postData : ', postData);
    const response = await axios.post(
      API_URL + '/auth/signup',
      postData,
      axiosConfig(),
    );
    console.log('response : ', response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

/**
 * /auth/sendCodeForVerifyRequest
 * @param postData: {sendTypeKind: SendTypeKind, phoneNumber: string, email: string}
 * @returns {Promise<T>}
 */
const sendEmailCode = async postData => {
  try {
    const response = await axios.post(
      API_URL + '/auth/sendCodeForVerifyRequest',
      postData,
      axiosConfig(),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const sendCode = async postData => {
  try {
    const response = await axios.post(
      API_URL + '/auth/sendCodeForVerifyRequest',
      postData,
      axiosConfig(),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

/**
 * /auth/changePassword
 * @param accessToken: string
 * @param postData: {email, newPassword: string}
 * @returns {Promise<T>}
 */
const changeUserPassword = async postData => {
  try {
    const response = await axios.patch(
      API_URL + '/auth/changePassword',
      postData,
      axiosConfig(),
    );
    return response.data; // return ?
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkIsExistUser = async queryData => {
  try {
    const response = await axios.get(API_URL + '/auth/existsByUserId', {
      params: queryData,
      validateStatus: function (status) {
        return status < 500;
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkIsExistPhoneNumber = async queryData => {
  try {
    const response = await axios.get(API_URL + '/auth/existsByPhoneNumber', {
      params: queryData,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkIsExistUserAndEmail = async queryData => {
  try {
    const response = await axios.get(API_URL + '/auth/existsByUserIdAndEmailAddress', {
      params: queryData,
      validateStatus: function (status) {
        return status < 500;
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkVerifyCode = async postData => {
  try {
    const response = await axios.post(
      API_URL + '/auth/checkverifycode',
      postData,
      axiosConfig(),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Wallet API ======================================================
 */

// const legacyAirdrop = async accessToken => {
//   try {
//     const response = await axios.post(
//       API_URL + '/wallet/legacyAirdrop',
//       {},
//       axiosConfig(accessToken),
//     );
//     return response.data;
//   } catch (e) {
//     console.log(e);
//   }
// };

/**
 * /wallet/withdraw
 * @param accessToken: string
 * @param postData: {receiveAddress: string, amount: string}
 * @returns {Promise<T>}
 */
const sendAsset = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + '/wallet/send',
      postData,
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const sendToAdmin = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + '/wallet/coinToPay',
      postData,
      axiosConfig(accessToken),
    );
    return response.data; // return ?
  } catch (e) {
    console.log(e);
  }
};

const getAppProperties = async (accessToken, postData) => {
  try {
    const response = await axios.get(
      API_URL + '/support/appProperties',
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getNoticesInUse = async accessToken => {
  try {
    const response = await axios.get(
      API_URL + '/support/notices/inuse',
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getEthAddress = async postData => {
  try {
    const response = await axios.post(GET_ETHER_ADDRESS, postData);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getBalance = async (accessToken, token, type) => {
  try {
    const response = await axios.get(
      API_URL + "/wallet/getbalance/" + type + "/" + token,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getTokenInfos = async () => {
  try {
    const response = await axios.get(GET_TOKEN_LIST());
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const getTransferEvent = async (accessToken, token, type) => {
  try {
    const response = await axios.get(
      API_URL + "/wallet/gettransactions/" + type + "/" + token,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const modifyUser = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + '/user/modify',
      postData,
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const validateAddress = async (postData) => {
  try {
    const response = await axios.post(
      API_URL + '/wallet/validateAddress',
      postData
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export {
  validateAccessToken,
  loginUser,
  signupUser,
  sendEmailCode,
  sendCode,
  checkIsExistUser,
  checkIsExistPhoneNumber,
  checkIsExistUserAndEmail,
  checkVerifyCode,
  changeUserPassword,
  getBalance,
  getTokenInfos,
  getTransferEvent,
  sendAsset,
  sendToAdmin,
  getAppProperties,
  getEthAddress,
  getNoticesInUse,
  modifyUser,
  validateAddress
};
