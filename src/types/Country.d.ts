type Country = {
    id: string
    name: string
    ISOCode: string
    flag: Flag
}

type Flag = {
    id: string
    name: string
    alternativeText: string
    url: string
    hash?: string
}