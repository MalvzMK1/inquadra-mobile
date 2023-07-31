function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

export default function getDistanceFromLatLonInKm(
    sourceLatitude: number,
    sourceLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
) {
    const earthRadiusKm = 6371;
    const dLat = degreesToRadians(destinationLatitude - sourceLatitude);
    const dLon = degreesToRadians(destinationLongitude - sourceLongitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(sourceLatitude)) *
        Math.cos(degreesToRadians(destinationLatitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}