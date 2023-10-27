import {gql} from "@apollo/client";

export interface IUserPaymentsCountryResponse {
	usersPermissionsUser: {
		data?: {
			id: User['id']
			attributes: {
				user_payments: {
					data: Array<{
						id: string
						attributes: {
							country: {
								data?: {
									id: Country['id']
									attributes: Omit<Country, 'id' | 'flag'>
								}
							}
						}
					}>
				}
			}
		}
	}
}

export interface IUserPaymentCountryVariable {
	id: string | number;
}

export const userPaymentCountryQuery = gql`
    query UserPaymentCard($id: ID) {
        usersPermissionsUser(id: $id) {
            data {
                id	
                attributes {
                    user_payments {
                        data {
                            id
                            attributes {
                                country {
                                    data {
                                        id
                                        attributes {
                                            name
                                            ISOCode
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