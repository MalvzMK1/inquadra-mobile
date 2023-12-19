import { gql } from "@apollo/client";

export interface IFavoriteEstablishmentByUserId {
  usersPermissionsUser: {
    data: {
      id: string;
      attributes: {
        favorite_establishments: {
          data: [
            {
              id: string;
            },
          ];
        };
      };
    };
  };
}

export const favoriteEstablishmentByUserIdQuery = gql`
  query getFavoriteEstablishmemtByUserId($userID: ID) {
    usersPermissionsUser(id: $userID) {
      data {
        id
        attributes {
          favorite_establishments {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
