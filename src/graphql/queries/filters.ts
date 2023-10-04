import { DocumentNode, gql } from "@apollo/client";

export interface IFilters {
  establishments: {
    data: [
      {
        id: Establishment["id"],
        attributes: {
          corporateName: Establishment["corporateName"],
          logo: {
            data: {
              attributes: {
                url: Establishment["logo"]
              }
            }
          }
          photos: {
            data: [
              {
                attributes: {
                  name: Photo["name"],
                  width: number,
                  height: number,
                  url: Photo["url"]
                }
              }
            ]
          }
          address: {
            latitude: Address["latitude"],
            longitude: Address["longitude"]
          },
          courts: {
            data: [
              {
                attributes: {
                  court_types: {
                    data: [
                      {
                        attributes: {
                          name: Court["name"]
                        }
                      }
                    ]
                  }
                  court_availabilities: {
                    data: [
                      {
                        attributes: {
                          weekDay: CourtAvailability["weekDay"],
                          startsAt: CourtAvailability["startsAt"],
                          endsAt: CourtAvailability["endsAt"],
                          dayUseServsice: CourtAvailability["dayUseService"]
                        }
                      },
                    ]
                  }
                }
              }
            ]
          },
        }
      }
    ]
  }
}



export interface IVariableFilter {
  amenities: string[] | [],
  startsAt: string | undefined,
  endsAt: string | undefined,
  dayUseService: boolean | undefined,
  weekDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | undefined
}

export const filtersQuery = gql`
query filters(
  $amenities: [String], 
  $startsAt: Time, 
  $endsAt: Time,
  $dayUseService: Boolean,
  $weekDay: String
) {
  establishments(filters: {
    amenities: {
      name: {
        in: $amenities
      }
    }
    courts: {
      court_availabilities: {
        startsAt: {
          contains: $startsAt
        }
        endsAt: {
          contains: $endsAt
        }
        dayUseService: {
          eq: $dayUseService
        }
        weekDay: {
          eq: $weekDay
        }
      }
    }
  }) {
    data {
      id
      attributes {
        corporateName
	      logo {
	        data {
		          attributes {
			            url
		          }
	        }
	      }
        photos {
            data {
                attributes {
                 name
                 width
                 height
                 url
                }
            }
        }
        address {
          latitude
          longitude
        }
        courts {
          data {
            attributes {
              court_types {
                data {
                  attributes {
                    name
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

// export const FilterQuery = ({ amenities, dayUseService, endsAt, startsAt, weekDay }: IVariableFilter): DocumentNode => {
//   let initialQuery = `query filters(
//         $amenities: ${amenities},
//         $startsAt: ${startsAt},
//         $endsAt: ${endsAt},
//         $dayUseService: ${dayUseService},
//         $weekDay: ${weekDay}
//     ) {
//     establishments(filters: {
//       amenities: {
//         id: {
//           in: $amenities
//         }
//       }
//       courts: {
//         court_availabilities: {`

//   if (startsAt) {
//     initialQuery = initialQuery + `startsAt: {
//           contains: $startsAt
//         }`
//   }
//   if (endsAt) {
//     initialQuery = initialQuery + `endsAt: {
//           contains: $endsAt
//         }`
//   }
//   if (dayUseService) {
//     initialQuery = initialQuery + `dayUseService: {
//           eq: $dayUseService
//         }`
//   }
//   if (weekDay) {
//     initialQuery = initialQuery + `weekDay: {
//           eq: $weekDay
//         }`
//   }

//   const query = initialQuery + ` }
//     }
//   }) {
//     data {
//       id
//       attributes {
//         corporateName
//         courts {
//           data {
//             attributes {
//               court_availabilities {
//                 data {
//                   attributes {
//                     weekDay
//                     startsAt
//                     endsAt
//                     dayUseService
//                   }
//                 }
//               }
//             }
//           }
//         }
//         amenities {
//           data {
//             id
//             attributes {
//               name
//             }
//           }
//         }
//       }
//     }
//   }
//     }`

//   return gql`query`

// }




