type Establishment = {
    id: string
    corporateName: string
    fantasyName: string
    cnpj?: string | undefined
    phoneNumber: string
    cellphoneNumber: string
    photo?: string | string[]
    logo?: {uri: string}
}