import axios, {AxiosRequestConfig} from "axios/index";

export default async function getAddress(zipCode: string): Promise<APICepResponse> {
	const config: AxiosRequestConfig = {
		method: 'get',
		url: `https://cdn.apicep.com/file/apicep/${zipCode}.json`
	}

	try {
		const response = await axios(config);
		return response.data as APICepResponse;
	} catch (err) {
		if (err instanceof Error) {
			throw new Error('Cannot find the address\n' + JSON.stringify(err));
		}
		throw new Error('Cannot find the address\n' + err);
	}
}

export class APICepResponse {
	public code;
	public state;
	public city;
	public district;
	public address;

	constructor(code: string, state: string, city: string, district: string, address: string) {
		this.code = code;
		this.state = state;
		this.city = city;
		this.district = district;
		this.address = address
	}
}
