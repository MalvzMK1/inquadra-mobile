import {gql} from "@apollo/client";

export enum EWeekDays {
	Monday,
	Sunday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday
}

export interface IAvailabilityByWeekDayResponse {
	courtAvailabilities: {
		data: Array<{
			id: string,
			attributes: {
				weekDay: string;
				startsAt: string;
				endsAt: string;
				status: boolean;
			}
		}>
	}
}
export interface IAvailabilityByWeekDayVariables {
	week_day: keyof typeof EWeekDays,
	court_id: string | number;
}

export const availabilityByWeekDayQuery = gql`
    query SchedulingByDay($week_day: String, $court_id: ID!) {
        courtAvailabilities(
            filters: { weekDay: { eq: $week_day }, court: { id: { eq: $court_id } } }
        ) {
            data {
                id
                attributes {
                    weekDay
                    status
                    endsAt
		                startsAt
                }
            }
        }
    }
`;