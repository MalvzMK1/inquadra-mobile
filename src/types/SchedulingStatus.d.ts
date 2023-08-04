enum SchedulingStatusEnum {
    Active = 'active',
    Finished = 'finished',
    Canceled = 'canceled'
}

type SchedulingStatus = keyof typeof SchedulingStatusEnum
