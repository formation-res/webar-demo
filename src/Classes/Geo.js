export function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters
  
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);
  
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance; // Distance in meters
  }
  
  // Example usage
  const distance = haversineDistance(37.7749, -122.4194, 34.0522, -118.2437);
  console.log(distance); // Output distance in meters

  // Function to calculate the bearing angle between two points
export function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => (angle * Math.PI) / 180;
  
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaLambda = toRad(lon2 - lon1);
  
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) -
              Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  
    const bearing = Math.atan2(y, x);
    const bearingDegrees = (bearing * 180) / Math.PI;
    const normalizedBearing = (bearingDegrees + 360) % 360; // Normalize to range [0, 360)
  
    return normalizedBearing; // Bearing angle in degrees
  }
  
  // Example usage
  const bearing = calculateBearing(37.7749, -122.4194, 34.0522, -118.2437);
  console.log(bearing); // Output bearing angle in degrees