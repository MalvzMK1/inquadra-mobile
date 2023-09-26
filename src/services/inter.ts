import {
	ApolloClient,
	gql,
	HttpLink,
	InMemoryCache,
	MutationTuple,
	QueryResult,
	useMutation,
	useQuery
} from "@apollo/client";
import { INTER_API } from '@env';

console.log(INTER_API)

export const interClient = new ApolloClient({
	link: new HttpLink({
		uri: INTER_API
	}),
	cache: new InMemoryCache(),
})

export interface ICreateChargeResponse {
	CreateCharge: {
		txid: string;
		pixCopiaECola: string;
		calendario: {
			dataDeVencimento: string;
		},
		status: string;
	}
}

export interface ICreateChargeVariables {
	dueDate: string
	discountDate: string
	value: string
	debtorCpf: string
	debtorName: string
	debtorCep: string
	debtorStreet: string
	debtorCity: string
	debtorUf: string
	message: string
}

export const createChargeMutation = gql`
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
        $discountDate: String!
    ) {
        CreateCharge(
            calendario: { dataDeVencimento: $dueDate, validadeAposVencimento: 30 }
            valor: {
                original: $value
                desconto: {
                    modalidade: "1"
                    descontoDataFixa: [{ data: $discountDate, valorPerc: "0.00" }]
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
            calendario {
                dataDeVencimento
            }
            status
        }
    }
`;

export function useCreateCharge(): MutationTuple<ICreateChargeResponse, ICreateChargeVariables> {
	return useMutation<ICreateChargeResponse, ICreateChargeVariables>(createChargeMutation, { client: interClient });
}

enum EPixStatus {
	ATIVA,
	CONCLUIDO,
}

export interface IPixInfosResponse {
	status: EPixStatus;
}

export interface IPixInfosVariables {
	txid: string;
}

export const pixInfosQuery = gql`
    query Pix($txid: String!) {
        ChargeInfos(txid: $txid) {
            status
        }
    }
`;

export function usePixInfosByTxid(txid: string): QueryResult<IPixInfosResponse, IPixInfosVariables> {
	return useQuery<IPixInfosResponse, IPixInfosVariables>(pixInfosQuery, {
		client: interClient,
		variables: {
			txid
		}
	});
}
