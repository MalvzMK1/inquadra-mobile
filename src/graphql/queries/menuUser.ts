import { gql } from "@apollo/client";

import { User } from "../../types/User";
import { Photo } from "../../types/Photo";

export interface IMenuUserResponse {
    usersPermissionsUser:{
        data: {
            id: User['id']
            attributes:{
                photo:{
                    data:{
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
    getInfoUserMenu($id: ID){
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


