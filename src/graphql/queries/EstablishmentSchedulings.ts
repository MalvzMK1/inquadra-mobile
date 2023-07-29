import { gql } from "@apollo/client";
// import { User } from "../../types/User";
// import { Scheduling } from "../../types/Scheduling";
// import { CourtAvailability } from "../../types/CourtAvailability";

export interface IEstablishmentSchedulingsResponse {
	schedulings:{
            data: {
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
                users: {
                    data: {
                        attributes: {
                            username: User['username']
                            email: User['email']
                            cpf: User['cpf']
                        }
                    }
                }
                court_availability: {
                    data: {
                        attributes: {
                            startsAt: CourtAvailability['startsAt']
                            endsAt: CourtAvailability['endsAt']
                            value: CourtAvailability['value']
                            dayUseService: CourtAvailability['dayUseService']
                        }
                    }
                }
            }
        }
    }
}

export interface IEstablishmentSchedulingsVariables {
	id: string
    date: Date
}

export const establishmentSchedulingQuery = gql`
    query GetEstablishmentsSchedulings($id: ID, $date: String!) {
    schedulings(
        filters: {
        court_availability: { court: { establishment: { id: { eq: $id } } } }
        date: { eq: $date }
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
