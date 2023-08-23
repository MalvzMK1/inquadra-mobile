import {gql} from "@apollo/client";
import {CourtType} from "../../__generated__/graphql";

export interface IEstablishmentAllSchedulesResponse {
	establishment: {
		data?: {
			attributes: {
				courts: {
					data: Array<{
						id: Court['id'],
						attributes: {
							court_types: {
								data: Array<{
									attributes: {
										name: CourtType['name']
									}
								}>
							},
							court_availabilities: {
								data: Array<{
									attributes: {
										startsAt: string,
										endsAt: string,
										schedulings: Array<{
											attributes: {
												date: string
											}
										}>
									}
								}>
							}
						}
					}>
				}
			}
		}
	}
}

export interface IEstablishmentAllSchedulesVariables {
	id: string
}

export const allEstablishmentSchedulesQuery = gql`
    query getAllEstablishmentSchedules($id: ID) {
        establishment(id: $id) {
            data {
                attributes {
                    courts {
                        data {
                            id
                            attributes {
                                court_types {
                                    data {
                                        attributes {
                                            name
                                        }
                                    }
                                }
                                court_availabilities {
                                    data {
                                        attributes {
                                            startsAt
                                            endsAt
                                            schedulings {
                                                data {
                                                    attributes {
                                                        date
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
            }
        }
    }
`
