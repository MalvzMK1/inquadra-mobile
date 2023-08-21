type CourtAvailibilityDay = {
    day: string
    setAllFalse: () => void
    children: JSX.Element
    clicked: boolean
    onClick: (boolean) => void
}