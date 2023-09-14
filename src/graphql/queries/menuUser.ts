import { gql } from "@apollo/client";

export interface IMenuUserResponse {
    usersPermissionsUser:{
        data?: {
            id: User['id']
            attributes:{
                photo:{
                    data?:{
                        id: Photo['id']
                        attributes:{
                            name: Photo['name']
                            url: Photo['url']
                        }
                    }
                }
            }
        }
    }
}

export interface IMenuUserVariables {
	id: string
}

export const menuUserQuery = gql`
    query getInfoUserMenu($id: ID){
        usersPermissionsUser(id: $id){
            data{
                attributes{
                    photo{
                        data{
                            id
                            attributes{
                                name
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;


