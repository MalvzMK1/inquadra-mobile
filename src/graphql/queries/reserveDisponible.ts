import { gql } from "@apollo/client";
import { Court } from "../../types/Court";
import { Establishment } from "../../types/EstablishmentInfos";
import { CourtAvailability } from "../../types/CourtAvailability";

export interface IReserveDisponibleResponse {
	courts: {
        data: {
            id: Court['id']
            attributes: {
                name:Court['name']
                establishment: {
                    data: {
                        id: Establishment['id']
                    }
                }
                court_availabilities: {
                    data: Array< {
                        id: CourtAvailability['id']
                        attributes: {
                            startsAt: CourtAvailability ['startsAt']
                            endsAt: CourtAvailability ['endsAt']
                            status:CourtAvailability ['status']
                        }
                    }>
                }
            }
        }
    }
}

export interface IReserveDisponibleVariables {
	weekDay: string
}

export const reserveDisponibleQuery = gql`
    query reserveDisponible ($weekDay: String!) {
    courts(filters: { court_availabilities: { weekDay: { eq: $weekDay } } }) {
        data {
            id
            attributes {
                name
                establishment {
                    data {
                        id
                    }
                }
                court_availabilities {
                    data {
                        id
                        attributes {
                        startsAt
                        endsAt
                        status
                        }
                    }
                }
            }
        }
    }
}`;