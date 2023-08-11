import { gql } from "@apollo/client";

export interface IEstablishmentSchedulingsResponse{
	schedulings:{
            data: Array<{
                id: Scheduling['id']  
                attributes: {
                    date: Scheduling['date']
                    valuePayed: Scheduling['valuePayed']
                    payedStatus: Scheduling['payedStatus']
                    owner: {
                        data: {
                            attributes: {
                                username: User['username']
                                email: User['email']
                                cpf: User['cpf']
                            }
                        }
                    }
                users:{
                    data: Array<{
                        attributes:{
                            username: User['username']
                            email: User['email']
                            cpf: User['cpf']
                        }
                    }>
                }
                court_availability:{
                    data:{
                        attributes:{
                            startsAt: string
                            endsAt: string
                            value: CourtAvailability['value']
                            dayUseService: CourtAvailability['dayUseService']
                        }
                    }
                }
            }
        }>
    }
}

export interface IEstablishmentSchedulingsVariables {
	id: string
    date: string
}

export const establishmentSchedulingQuery = gql`
    query GetEstablishmentsSchedulings($id: ID, $date: DateTime!) {
    schedulings(
        filters: {
        court_availability: { court: { establishment: { id: { eq: $id } } } }
        date: { eq: $date }
        }){
            data {
                id  
                attributes {
                    date
                    valuePayed
                    payedStatus
                    owner {
                        data {
                            attributes {
                                username
                                email
                                cpf
                            }
                        }
                    }
                users {
                    data {
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
                        }
                    }
                }
            }
        }
    }
}`;
