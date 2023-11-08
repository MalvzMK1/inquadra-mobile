type Scheduling = {
    id: string
    schedulingTitle: string
    court_availability: string
    date: Date
    users: Array<string>
    valuePayed: number
    payedStatus: 'waiting' | 'payed' | 'canceled'
    owner: string
    payDay: Date
    activation_key: string
}