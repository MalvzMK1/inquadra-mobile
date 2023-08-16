import axios from "axios";
import { SchedulingEntity, UsersPermissionsUserEntity } from "../__generated__/graphql";
import { generateInvoice } from "../services/iugu";
import uuid from 'react-native-uuid'

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

    let {data: userAddress} = await axios.get<FindAddressByCepResponse>(`https://example.api.findcep.com/v1/cep/${user.attributes?.address?.cep}.json`)
      console.log(userAddress)

		if (!user.attributes?.phoneNumber) throw new Error('Deve ser passado um número de telefone para contato.');
		if (!scheduling.attributes.court_availability?.data) throw new Error('Nenhum dado sobre a disponibilidade de quadra encontrado');
		if (!scheduling.attributes.court_availability.data.attributes?.court) throw new Error('Nenhum dado sobre a quadra encontrado');
		if (!scheduling.attributes.court_availability.data.attributes.court.data?.attributes) throw new Error('Nenhum dado sobre a quadra encontrado');

		if (user.attributes) {
			return {
				email: user.attributes.email,
				due_date: '2023-12-31',
				items: [
					{
						description: scheduling.attributes.court_availability.data.attributes.court.data.attributes.name,
						price_cents: valueToBePayedPerUser,
						quantity: 1,
					},
				],
				payable_with: ['credit_card', 'pix'],
				payer: {
          cpf_cnpj: user.attributes.cpf,
          phone: user.attributes.phoneNumber,
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