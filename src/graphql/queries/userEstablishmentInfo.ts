import { gql } from "@apollo/client";

export interface IUserEstablishmentResponse {
    usersPermissionsUser: {
        data: {
            attributes: {
                username: User['username']
                email: User['email']
                phoneNumber: User['phoneNumber']
                cpf: User['cpf']
                photo: {
                    data: {
                        attributes: {
                            url: Photo['url']
                        }
                    }
                }
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
                        } & {
                            photos: {
                                data: Array<{
                                    id: Photo['id']
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
                    photo {
                        data {
                            attributes {
                                url
                            }
                        }
                    }
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
                                photos {
                                    data {
                                        id
                                    }
                                }
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
