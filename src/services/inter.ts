import {Axios, AxiosResponse} from 'axios';
import {CLIENT_ID, CLIENT_SECRET, INTER_API_CERTIFICATE, INTER_API_KEY} from '@env';

const BASE_URL = 'https://pix.bcb.gov.br/api/v2'
const SCOPE = 'pix.read pix.write webhook.read webhook.write cob.read cob.write cobv.read cobv.write payloadlocation.read payloadlocation.write\n';
const TOKEN_URL = 'http://inter-oauth-server:8080/token';

const axios = new Axios({
	url: BASE_URL,
	// httpsAgent: {
	// 	cert: INTER_API_CERTIFICATE,
	// 	key: INTER_API_KEY
	// }
})

interface IAuthTokenResponse {
	access_token: string,
	token_type: string,
	expires_in: number,
	scope: string,
}

export function generateAuthToken(): void {
	try {
		const params = new FormData();
		//
		params.append('grant_type', 'client_credentials');
		params.append('client_id', CLIENT_ID);
		params.append('client_secret', CLIENT_SECRET);
		params.append('scope', SCOPE);

		fetch(BASE_URL + '/token', {
			method: 'POST',
			body: params
		})
			.then(response => response.json())
			.then(data => console.log(data.error.details))
			.catch(error => console.warn(error))

		// new Axios().get('https://inquadra-api-uat.qodeless.io/api/users')
		// 	.then(response => response.data)
		// 	.then(console.warn)

		// axios.get('https://inquadra-api-uat.qodeless.io/api/users')
		// 	.then(response => console.log({INTER_RESPONSE: response}))
	} catch (e) {
		console.error({error: e})
	}
}

// const params = new URLSearchParams();
// params.append('grant_type', 'client_credentials');
// params.append('client_id', CLIENT_ID);
// params.append('client_secret', CLIENT_SECRET);
// params.append('scope', SCOPE);
//
// axios.post(httpInterOauthServer8080Token, params)
// 	.then((response) => {
// 		const authToken = response.data.access_token;
// 		console.log('Token de Acesso:', authToken);
// 		consultarPix(authToken); // Passa o authToken como argumento para a função
// 	})
// 	.catch((error) => {
// 		console.error('Erro ao obter o Token de Acesso:', error);
// 	});

// function consultarPix(authToken) {
// 	const apiBaseUrl = 'https://cdpj.partners.bancointer.com.br/pix/v2/cob';
// 	const endToPixId = '617c1e60-2b17-4ec2-990c-822750c0d899';
//
// 	const config = {
// 		headers: {
// 			'Authorization': `Bearer ${authToken}`,
// 		}
// 	};
//
// 	axios.get(`${apiBaseUrl}/pix/${endToPixId}`, config)
// 		.then((response) => {
// 			console.log('Dados do Pix:', response.data);
// 		})
// 		.catch((error) => {
// 			console.error('Erro ao consultar o Pix:', error);
// 		});
// }