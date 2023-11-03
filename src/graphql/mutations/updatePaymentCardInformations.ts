import {gql} from "@apollo/client";

export interface IUpdatePaymentCardInformationsResponse {
	updateUsersPermissionsUser: {
		data: {
			attributes: {
				username: User['username'],
				paymentCardInformations: {
					cvv: PaymentCardInformations['cvv'],
					dueDate: PaymentCardInformations['dueDate'],
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
}

export const updatePaymentCardInformationsQuery = gql`
    mutation updateUserPaymentCardInformations(
        $user_id: ID!
        $card_cvv: Int
        $card_due_date: Date
    ) {
        updateUsersPermissionsUser(
            id: $user_id
            data: {
                paymentCardInformations: {
                    cvv: $card_cvv
                    dueDate: $card_due_date
                }
            }
        ) {
            data {
                attributes {
                    username
                    paymentCardInformations {
                        cvv
                        dueDate
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
