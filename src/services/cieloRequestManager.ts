import {
	CIELO_MERCHANT_ID,
	CIELO_MERCHANT_KEY,
	CIELO_API_URL,
	CIELO_QUERY_API_URL
} from '@env';
import axios, {AxiosError, AxiosRequestConfig} from 'axios';

export class CieloRequestManager {
	private BASE_URL: string = "https://apisandbox.cieloecommerce.cielo.com.br"
	private BASE_QUERY_URL: string = "https://apiquerysandbox.cieloecommerce.cielo.com.br"
	private MERCHANT_ID: string = "13b14d93-49a1-47dc-8761-98c71281dc82"
	private MERCHANT_KEY: string = "JMPXCJFXNEKSWIAKDGUSSAUKSPIORRDUBLJSXQYE"

	public async authorizePayment(data: AuthorizeCreditCardPaymentResponse): Promise<AuthorizeCreditCardPaymentResponse> {
		const axiosConfig: AxiosRequestConfig = {
			baseURL: `${this.BASE_URL}/1/sales`,
			method: 'POST',
			headers: {
				"Content-Type": 'application/json',
				merchantId: this.MERCHANT_ID,
				merchantKey: this.MERCHANT_KEY,
			},
			data
		}

		try {
			const {data: authorizeCreditCard} = await axios<AuthorizeCreditCardPaymentResponse>(axiosConfig)
			return authorizeCreditCard
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err.toJSON())
				throw new Error(err.message)
			}
			throw new Error('An error ocurred while trying to create a payment with CIELO\n' + String(err));
		}
	}

	async confirmPayment(paymentId: string) {
		const axiosConfig: AxiosRequestConfig = {
			baseURL: `${this.BASE_URL}/1/sales/${paymentId}/capture`,
			method: 'PUT',
			headers: {
				merchantId: this.MERCHANT_ID,
				merchantKey: this.MERCHANT_KEY,
			},
		}

		try {
			const {data} = await axios<ConfirmCreditCardPaymentResponse>(axiosConfig);
			return data;
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err.toJSON())
				throw new Error(err.message)
			}
			throw new Error('An error ocurred while trying to create a payment with CIELO\n' + String(err));
		}
	}

	async getPaymentInformations(paymentId: string) {
		const axiosConfig: AxiosRequestConfig = {
			baseURL: `${this.BASE_QUERY_URL}/1/sales/${paymentId}`,
			method: 'GET',
			headers: {
				merchantId: this.MERCHANT_ID,
				merchantKey: this.MERCHANT_KEY,
			},
		}

		try {
			const {data} = await axios<ConfirmCreditCardPaymentResponse>(axiosConfig);
			return data;
		} catch (err) {
			if (err instanceof AxiosError) {
				console.log(err.toJSON())
				throw new Error(err.message)
			}
			throw new Error('An error ocurred while trying to create a payment with CIELO\n' + String(err));
		}
	}
}
