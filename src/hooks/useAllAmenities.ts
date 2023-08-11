import {QueryResult, useQuery} from "@apollo/client";
import {allAmenitiesQuery, IAllAmenitiesResponse} from "../graphql/queries/allAmenities";

export default function useAllAmenities(): QueryResult<IAllAmenitiesResponse> {
	return useQuery<IAllAmenitiesResponse>(allAmenitiesQuery);
}
