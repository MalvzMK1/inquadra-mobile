import axios, { AxiosRequestConfig } from 'axios';
import {
    CIELO_MERCHANT_ID,
    CIELO_MERCHANT_KEY,
    CIELO_API_URL,
    CIELO_QUERY_API_URL
} from "@env";
import { secondsInMinute } from 'date-fns/constants/index.js';

const headers = {
    headers: {
        'merchantId': CIELO_MERCHANT_ID,
        'merchantKey': CIELO_MERCHANT_KEY
    }
}

export const generatePix = async (pixInfos: RequestGeneratePix): Promise<ResponseGeneratedPix> => {
    try {
        const response = await axios.post(`${CIELO_API_URL}/1/sales`, pixInfos, headers)

        return response.data
    } catch (error) {

        console.log(error)
        throw error
    }
}

export const verifyPixStatus = async (paymentID: string): Promise<ResponseVerifyPixStatus> => {
    try {
        const response = await axios.get(`${CIELO_QUERY_API_URL}/1/sales/${paymentID}`, headers)

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const devolutionPix = async (paymentID: string, amount: number): Promise<ResponseDevolutionPix> => {
    const axiosConfig: AxiosRequestConfig = {
        baseURL: `${CIELO_API_URL}/1/sales/${paymentID}/void?amount=${amount}`,
        method: 'PUT',
        headers: {
            merchantId: headers.headers.merchantId,
            merchantKey: headers.headers.merchantKey
        },
    }

    try {
        const { data } = await axios<ResponseDevolutionPix>(axiosConfig)

        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}