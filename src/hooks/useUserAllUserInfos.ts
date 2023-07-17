import {useQuery, gql} from '@apollo/client';

interface IUserDatas {
	id: string
	attributes: {
		username: string
		email: string
		cpf: string
		photo: {
			data: {
				attributes: {
					url: string
				}
			}
		}
	}
}

const USER_QUERY = gql`
		query {
    	usersPermissionsUsers {
      	  data {
        	    id
          	  attributes {
            	    username
              	  email
                	cpf
                	photo {
                  	  data {
                    	    attributes {
                      	      url
                      	  }
                    	}
                	}
            	}
        	}
	    }
		}
`;

export default function useUsersQuery(): Array<IUserDatas> {
	const {data, loading, error} = useQuery<{usersPermissionsUsers: Array<IUserDatas>}>(USER_QUERY)

	while (loading)
		if (data?.usersPermissionsUsers)
			return data?.usersPermissionsUsers
	throw new Error(error?.message)
}
