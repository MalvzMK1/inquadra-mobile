import { gql } from "@apollo/client";

export interface ISchedulingByDateResponse {
    schedulings: {
        data?: Array<{
            id: Schedule['id'],
            attributes: {
                date: Schedule['date'],
                court_availability: {
                    data: {
                        attributes: {
                            court: {
                                data: {
                                    id: Court['id']
                                }
                            }
                        }
                    }
                }
            }
        }>
    }
}

export interface ISchedulingByDateVariables {
    date: {
        eq: string
    }
    court_id: {
        eq: string
    }
}

export const schedulingByDateQuery = gql`
    query SchedulingByDay($date: DateFilterInput, $court_id: IDFilterInput) {
  schedulings(filters: {
  	date: $date,
    court_availability: {
      court: {
        id: $court_id
      }
    }
  }) {
    data {
    	id
      attributes {
        date
        court_availability {
          data {
            attributes {
              court {
                data {
                  id
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