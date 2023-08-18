export interface IPaymentCardCountriesResponse {
	countries: {
		data: {
			id: Country['id']
			attributes: Omit<Country, 'id' | 'flag'> & {
				flag: {
					data: {
						attributes: Omit<Flag, 'id' | 'name' | 'alternativeText'>
					}
				}
			}
		}
	}
}
