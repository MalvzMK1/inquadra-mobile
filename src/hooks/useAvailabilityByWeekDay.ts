import {QueryResult, useQuery} from "@apollo/client";
import {
	availabilityByWeekDayQuery,
	IAvailabilityByWeekDayResponse,
	IAvailabilityByWeekDayVariables
} from "../graphql/mutations/availabilityByWeekDay";

export default function useAvailabilityByWeekDay(): QueryResult<IAvailabilityByWeekDayResponse, IAvailabilityByWeekDayVariables> {
	return useQuery<IAvailabilityByWeekDayResponse, IAvailabilityByWeekDayVariables>(availabilityByWeekDayQuery);
}
