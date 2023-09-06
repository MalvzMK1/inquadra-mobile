import {ApolloClient, gql, InMemoryCache, MutationTuple, useMutation} from "@apollo/client";
import {INTER_API} from '@env';

export const client = new ApolloClient({
	uri: INTER_API,
	cache: new InMemoryCache()
})

interface ICreateChargeResponse {
	txid: string;
	pixCopiaECola: string;
	status: string;
	calendario: {
		dataDeVencimento: string;
	}
}

interface ICreateChargeVariables {
	dueDate: string;
	value: string;
	debtorCpf: string;
	debtorName: string;
	debtorCep: string;
	debtorStreet: string;
	debtorCity: string;
	debtorUf: string;
	message: string;
}

const createChargeMutation = gql`
    mutation DueCharge(
        $dueDate: String!
        $value: String!
        $debtorCpf: String!
        $debtorName: String!
        $debtorCep: String!
        $debtorStreet: String!
        $debtorCity: String!
        $debtorUf: String!
        $message: String!
    ) {
        CreateCharge(
            calendario: { dataDeVencimento: $dueDate, validadeAposVencimento: 30 }
            valor: {
                original: $value
                desconto: {
                    modalidade: "1"
                    descontoDataFixa: [{ data: "2024-02-01", valorPerc: "0.00" }]
                }
                multa: { modalidade: "1", valorPerc: "0.00" }
                juros: { modalidade: "1", valorPerc: "0.00" }
            }
            devedor: {
                cpf: $debtorCpf
                nome: $debtorName
                cep: $debtorCep
                logradouro: $debtorStreet
                cidade: $debtorCity
                uf: $debtorUf
            }
            solicitacaoPagador: $message
        ) {
            txid
            pixCopiaECola
		        status
		        calendario {
				        dataDeVencimento
		        }
        }
    }
`

export function useCreateCharge(): MutationTuple<ICreateChargeResponse, ICreateChargeVariables> {
	return useMutation<ICreateChargeResponse, ICreateChargeVariables>(createChargeMutation);
}
