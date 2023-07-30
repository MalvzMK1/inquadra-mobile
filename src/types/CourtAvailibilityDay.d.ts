type CourtAvailibilityDay = {
    day: string
    buttonBoolean: boolean
    setter: React.Dispatch<React.SetStateAction<boolean>>
    setAllFalse: () => void
}