import useUserPaymentCountry from "../hooks/useUserPaymentCountry";
import {IUserPaymentsCountryResponse} from "../graphql/queries/userPaymentsCountry";

export function getUsersCountryId(userId: User['id'] | undefined, data: IUserPaymentsCountryResponse): string | number | undefined {
	const FIRST_ARRAY_INDEX = 0;

	if (!userId) return undefined

	if (
		data &&
		data.usersPermissionsUser.data &&
		data.usersPermissionsUser.data.attributes.user_payments.data.length > 0
	) {
		const {data: userPayments} = data.usersPermissionsUser.data.attributes.user_payments;

		const countries = userPayments.map(userPayment => {
			if (
				userPayment.attributes.country.data
			)
				return userPayment.attributes.country.data
		})

		if (
			countries.length > 0 &&
			countries[FIRST_ARRAY_INDEX]
		)
			return countries[FIRST_ARRAY_INDEX].id
	}
}
