import { gql } from "@apollo/client";
import { User } from "../../types/User";
import { Establishment } from "../../types/EstablishmentInfos";
import { PixKey } from "../../types/PixKey";
import { Court } from "../../types/Court";
import { Address } from "../../types/Address";
import { Amenitie } from "../../types/Amenitie";
import { Scheduling } from "../../types/Scheduling";

export interface IEstablishmentSchedulingsResponse {
	scheduling:{
        data: {
            id: Scheduling['id']
            attributes:{

            } 
        } 
    }
}

export interface IEstablishmentSchedulingsVariables {
	id: string
}

export const establishmentsSchedulingsQuery = gql`
    query dayReserveDisponible {
    courts(filters: { court_availabilities: { weekDay: { eq: "Wednesday" } } }) {
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