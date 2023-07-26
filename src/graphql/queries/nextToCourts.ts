import { gql } from "@apollo/client";


export interface INextToCourtResponse{
    courts: {
        data: Array<{
            id: Court ['id'];
            attributes: {
                name: Court ['name']
                court_type:{
                    data:{
                        attributes:{
                            name: SportType['name']
                        }
                    }
                } & {
                    photo: {
                        data: Array< {
                            attributes:{
                                url: Photo['url']
                            }
                        }>
                    } 
                } & {
                    establishment:{
                        data:{
                            id: Establishment['id']
                            attributes: Omit<Establishment, 'id'> & {
                                address: {
                                    data: {
                                        latitude: Address['latitude']
                                        longitude: Address['longitude']    
                                    }
                                }
                            }
                        }
                    }
                }     
            }
        }>
    }
}

export const useNextToCourtQuery = gql`
    query nextToCourt{
        courts{
            data{
                id
                attributes{
                    name
                    court_type{
                        data{
                            attributes{
                            name
                            }
                        }
                    }
                    photo{
                        data{
                            attributes{
                                url
                            }
                        }
                    }
                    establishment{
                        data{
                            id
                            attributes{
                                address{
                                    latitude
                                    longitude
                                }
                            }
                        } 
                    }
                }
            }
        }
    }
`;
