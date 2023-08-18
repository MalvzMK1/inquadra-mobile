export function calculateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
): number {
    const earthRadiusMeters = 6371000;
    const dLat = deg2rad(latitude2 - latitude1);
    const dLon = deg2rad(longitude2 - longitude1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusMeters * c;
    return distance;
}

function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
}