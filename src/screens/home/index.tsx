import { View, Text } from 'react-native';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import { useQuery, gql } from '@apollo/client';
import { SchedulingEntityResponseCollection } from '../../__generated__/graphql';
import { Button } from 'react-native-paper';
import { integrateWithPaymentAPI } from '../../utils/integrationWithPaymentAPI';

const GET_SCHEDULINGS = gql`
	query {
		schedulings(
			filters: {
				court_availability: { court: { establishment: { id: { eq: 1 } } } }
				date: { eq: "2023-07-19" }
			}
		) {
			data {
				id
				attributes {
					date
					valuePayed
					payedStatus
					owner {
						data {
							id
							attributes {
								username
								email
								cpf
							}
						}
					}
					users {
						data {
							id
							attributes {
								username
								email
								cpf
							}
						}
					}
					court_availability {
						data {
							attributes {
								startsAt
								endsAt
								value
								dayUseService
								court {
									data {
										attributes {
											name
											court_type {
												data {
													attributes {
														name
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default function Home() {
	const { data, loading, error } = useQuery(GET_SCHEDULINGS);

	if (loading) return <Text>Loading...</Text>;
	else console.log('CARREGOU');
	if (error) console.log(error);

	const schedulings = data.schedulings as SchedulingEntityResponseCollection;

	return (
		<View className="flex-1 flex flex-col">
			<View className="flex-1 bg-red-500"></View>
			<Button onPress={() => integrateWithPaymentAPI(schedulings.data[0])}>
				<Text>INTEGRA AI</Text>
			</Button>
			<BottomNavigationBar />
		</View>
	);
}
