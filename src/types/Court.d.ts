type CourtCardInfos = {
	id: string
	image: string
	name: string
	type: string | string[]
	distance: number
	liked: boolean
	userId: string
}

type Court = {
	id: string
	name: string
	rating: number
	fantasy_name: string
	address: string
	image: string
}

type CourtAdd = {
    court_name: string;
    courtType: string[];
    fantasyName: string;
    photos: string[];
    court_availabilities: string[];
    minimum_value: number;
    currentDate: string;
};
