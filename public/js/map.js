document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const mapToken = mapElement.dataset.token;
    let listing = {};
    try {
        listing = JSON.parse(mapElement.dataset.listing || "{}");
    } catch (e) {
        console.error("Failed to parse listing data:", e);
    }

    if (mapToken && mapToken.startsWith("pk.")) {
        mapboxgl.accessToken = mapToken;

        const coordinates = (listing.geometry && Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2)
            ? listing.geometry.coordinates
            : [77.2090, 28.6139];

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: coordinates,
            zoom: 9,
        });

        map.addControl(new mapboxgl.NavigationControl());

        const title = listing.title || "Listing";
        const location = listing.location ? `${listing.location}, ${listing.country || ''}` : "Exact location provided after booking";

        const popupContent = `
            <div style="padding: 5px;">
                <h6 style="font-weight: 700; margin-bottom: 4px;">${title}</h6>
                <p style="font-size: 0.85rem; color: #555; margin: 0;">${location}</p>
                <p style="font-size: 0.75rem; color: #888; margin-top: 4px; margin-bottom: 0;">Exact location provided after booking.</p>
            </div>
        `;

        const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim() || "#0d6efd";

        new mapboxgl.Marker({ color: themeColor })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
            .addTo(map);
    } else {
        const title = listing.title || "Listing Preview";
        const location = listing.location ? `${listing.location}, ${listing.country || ''}` : "Location not specified";
        mapElement.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-muted border rounded" style="min-height: 300px;">
                <i class="fa-solid fa-map-location-dot fa-3x mb-2 text-danger"></i>
                <h5>${title}</h5>
                <p class="small text-muted mb-0">${location}</p>
                <small class="text-secondary mt-1">(Add your MAP_TOKEN in .env or Render dashboard to view live Mapbox map)</small>
            </div>
        `;
    }
});
