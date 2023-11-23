import axios, { AxiosRequestConfig } from 'axios';

const headers = {
    headers: {
        'merchantId': "51cb1016-2778-41ef-820f-d47ae642ad6f",
        'merchantKey': "CQWr1W6w8IFmFGApQ15UoRuNYYSomcop3fmzpceG"
    }
}

const CIELO_API_URL         = "https://api.cieloecommerce.cielo.com.br"
const CIELO_QUERY_API_URL   = "https://apiquery.cieloecommerce.cielo.com.br"

export const generatePix = async (pixInfos: RequestGeneratePix): Promise<ResponseGeneratedPix> => {
    try {
        const response = await axios.post(`${CIELO_API_URL}/1/sales`, pixInfos, headers)

        alert(response.data)
        return response.data
    } catch (error) {

        alert(error)
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