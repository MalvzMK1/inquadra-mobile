import {gql} from "@apollo/client";

export interface IUpdatePaymentCardInformationsResponse {
	updateUsersPermissionsUser: {
		data: {
			attributes: {
				username: User['username'],
				paymentCardInformations: {
					cvv: PaymentCardInformations['cvv'],
					dueDate: PaymentCardInformations['dueDate'],
					country: {
						data: {
							attributes: {
								name: Country['name'],
								flag: {
									data: {
										attributes: {
											url: Country['flag']['url']
										}
									}
								}
							}
						}
					},
					role: {
						data: {
							attributes: Omit<Role, 'id'>
						}
					}
				}
			}
		}
	}
}

export interface IUpdatePaymentCardInformationsVariables {
	user_id: string,
	card_cvv: number,
	card_due_date: string,
	country_flag_id: string,
}

export const updatePaymentCardInformationsQuery = gql`
    mutation updateUserPaymentCardInformations(
        $user_id: ID!
        $card_cvv: Int
        $card_due_date: Date
        $country_flag_id: ID
    ) {
        updateUsersPermissionsUser(
            id: $user_id
            data: {
                paymentCardInformations: {
                    cvv: $card_cvv
                    dueDate: $card_due_date
                    country: $country_flag_id
                }
            }
        ) {
            data {
                attributes {
                    username
                    paymentCardInformations {
                        cvv
                        dueDate
                        country {
                            data {
                                attributes {
                                    name
                                    flag {
                                        data {
                                            attributes {
                                                url
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    role {
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
`
