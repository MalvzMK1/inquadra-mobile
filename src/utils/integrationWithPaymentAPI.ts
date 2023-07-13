import axios from "axios";
import { SchedulingEntity, UsersPermissionsUserEntity } from "../__generated__/graphql";
import { generateInvoice } from "../services/iugu";
import uuid from 'react-native-uuid'

type FindAddressByCepResponse = {
  uf: string
  cidade: string
  bairro: string
  logradouro: string
  cep: string
  complemento: string
  nome: string
  status: string
}

export function integrateWithPaymentAPI(scheduling: SchedulingEntity) {
	const users = scheduling.attributes?.users?.data;
	const value =
		scheduling.attributes?.court_availability?.data?.attributes?.value;

	if (users === undefined) throw new Error('Users field is undefined');
	if (value === undefined) throw new Error('Value field is undefined');

	const invoices: CreateInvoiceResponse[] = [];

	users.forEach(async (user, index) => {
		const invoice = await generateIuguApiBodyRequest(scheduling, user.id, Math.round((value/users.length) * 100))
    invoices[index] = await generateInvoice(invoice)
	});
}

async function generateIuguApiBodyRequest(
	scheduling: SchedulingEntity,
	userID: string,
	valueToBePayedPerUser: number
): Promise<CreateInvoiceRequestBody> {
  const GENERATED_UUID = uuid.v4().toString();
	if (scheduling.attributes?.users) {
		const user = scheduling.attributes?.users.data.find(
			(user) => user.id === userID
		) as UsersPermissionsUserEntity;

    let {data: userAddress} = await axios.get<FindAddressByCepResponse>(`https://example.api.findcep.com/v1/cep/01234000.json`)
      
		if (user !== undefined && user.attributes) {
			return {
				email: user.attributes.email,
				due_date: '2023-12-31',
				items: [
					{
						description:
							scheduling.attributes.court_availability?.data?.attributes?.court
								?.data?.attributes?.name,
						price_cents: valueToBePayedPerUser,
						quantity: 1,
					},
				],
				payable_with: ['credit_card'],
				payer: {
          cpf_cnpj: user.attributes.cpf,
          phone: '11555554444',
          phone_prefix: '55',
					email: user.attributes.email,
					name: user.attributes.username,
					address: {
						zip_code: userAddress.cep,
						street: userAddress.logradouro,
            city: userAddress.cidade,
            complement: userAddress.complemento,
            country: 'BR',
            district: userAddress.bairro,
            number: '12',
            state: userAddress.uf
					}
				},
        order_id: GENERATED_UUID
			};
		}
	}
	throw new Error();
}