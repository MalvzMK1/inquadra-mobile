import {gql} from "@apollo/client";

const mutation = gql`
    mutation uploadPhoto(
        $ref_id: ID!
        $ref: String
        $field: String
        $file: Upload!
    ) {
        upload(refId: $ref_id, ref: $ref, field: $field, file: $file) {
            data {
                id
                attributes {
                    url
                }
            }
        }
    }
`

