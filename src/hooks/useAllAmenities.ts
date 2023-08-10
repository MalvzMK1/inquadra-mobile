import {useQuery} from "@apollo/client";
import {allAmenitiesQuery, IAllAmenitiesResponse} from "../graphql/queries/allAmenities";

export default function useAllAmenities() {
	return useQuery<IAllAmenitiesResponse>(allAmenitiesQuery);
}