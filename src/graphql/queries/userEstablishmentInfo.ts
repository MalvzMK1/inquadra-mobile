import {gql} from "@apollo/client";
import { User } from "../../types/User";
import { Establishment } from "../../types/EstablishmentInfos";
import { PixKey } from "../../types/PixKey";
import { Court } from "../../types/Court";
import { Address } from "../../types/Address";
import { Amenitie } from "../../types/Amenitie";

export interface IUserEstablishmentResponse {
	usersPermissionsUser: {
		data: {
			attributes: {
				username: User['username']
				email: User['email']
				phoneNumber: User['phoneNumber']
				cpf: User['cpf']
				establishment: {
					data: {
						id: Establishment['id']
						attributes: Omit<Establishment, 'id'> & {
							pix_keys: {
								data: Array<{
									id: PixKey['id']
									attributes: Omit<PixKey, 'id'>
								}>
							}
						} & {
							courts: {
								data: Array<{
									id: Court['id']
									attributes: Omit<Court, 'id' | 'rating'>
								}>
							}
						} & {
							address: Address
						} & {
							amenities: {
								data: Array<{
									id: Amenitie['id']
									attributes: Omit<Amenitie, 'id'>
								}>
							}
						}
					}
				}
			}
		}
		__typename: string
	}
}

export interface IUserEstablishmentVariables {
	id: string
}

export const userEstablishmentQuery = gql`
    query getInfosEstablishment($id: ID) {
        usersPermissionsUser(id: $id) {
            data {
                attributes {
                    username
                    email
                    phoneNumber
                    cpf
                    establishment {
                        data {
                            id
                            attributes {
                                pix_keys {
                                    data {
                                        id
                                        attributes {
                                            key
                                        }
                                    }
                                }
                                corporateName
                                cnpj
                                fantasyName
                                address {
                                    id
                                    streetName
                                    cep
                                    latitude
                                    longitude
                                }
                                amenities {
                                    data {
                                        id
                                        attributes {
                                            name
                                        }
                                    }
                                }
                                courts {
                                    data {
                                        id
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
`;

console.log(userEstablishmentQuery)