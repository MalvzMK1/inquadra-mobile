import {
	CIELO_MERCHANT_ID,
	CIELO_MERCHANT_KEY,
	CIELO_API_URL,
	CIELO_QUERY_API_URL
} from '@env';
import {AxiosRequestConfig} from "axios/index";
import axios, {AxiosError} from 'axios';
import * as https from "https";

export class CieloRequestManager {
	BASE_URL: string = CIELO_API_URL
	BASE_QUERY_URL: string = CIELO_QUERY_API_URL
	MERCHANT_ID: string = CIELO_MERCHANT_ID
	MERCHANT_KEY: string = CIELO_MERCHANT_KEY
	// axios = new Axios()

	async authorizePayment(data: IAuthorizeCreditCardPaymentResponse): Promise<IAuthorizeCreditCardPaymentResponse> {
		const axiosConfig: AxiosRequestConfig = {
			baseURL: this.BASE_URL,
			method: 'POST',
			headers: {
				"Content-Type": 'application/json',
				merchantId: this.MERCHANT_ID,
				merchantKey: this.MERCHANT_KEY,
			},
			data
		}

		try {
			const {data: authorizeCreditCard} = await axios<IAuthorizeCreditCardPaymentResponse>(axiosConfig)
			return authorizeCreditCard
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err.toJSON())
				throw new Error(err.message)
			}
			throw new Error('An error ocurred while trying to create a payment with CIELO\n' + String(err));
		}
	}
}
