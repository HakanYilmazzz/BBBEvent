document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const loadingElement = document.getElementById('loading');
    const venueFilter = document.getElementById('venue-filter');
    let allEvents = [];

    const fetchEvents = async () => {
        try {
            const response = await fetch(config.PROXY_URL + config.API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error('Veri alınamadı');
            }

            const rawData = await response.text();
            const cleanData = rawData.replace(/\\"/g, '"').replace(/^"|"$/g, '');
            const data = JSON.parse(cleanData);
            return data;
        } catch (error) {
            console.error('Hata:', error);
            loadingElement.textContent = 'Etkinlikler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.';
            return null;
        }
    };

    const updateVenueFilter = (events) => {
        const venues = [...new Set(events.map(event => event.mekan))];
        venues.sort((a, b) => a.localeCompare(b, 'tr'));
        venues.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue;
            option.textContent = venue;
            venueFilter.appendChild(option);
        });
    };

    const displayEvents = (events) => {
        eventsContainer.innerHTML = '';
        loadingElement.style.display = 'none';
        
        if (!Array.isArray(events)) {
            console.error('Veri array formatında değil');
            loadingElement.textContent = 'Veri formatında hata oluştu.';
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            const imageUrl = `${config.IMAGE_BASE_URL}${event.pic}`;
            
            eventCard.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${event.etkinlik}" class="event-image" onerror="this.src='https://via.placeholder.com/300x200?text=Görsel+Bulunamadı'">
                    <div class="image-overlay"></div>
                </div>
                <div class="event-info">
                    <h2 class="event-title">${event.etkinlik}</h2>
                    <p class="event-date">${event.tarih} - ${event.saat}</p>
                    <p class="event-venue">${event.mekan}</p>
                    <a href="${config.SITE_BASE_URL}/${event.url}" target="_blank" class="event-link">Bilet Al</a>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });
    };

    const filterEvents = () => {
        const selectedVenue = venueFilter.value;
        
        if (selectedVenue === '') {
            displayEvents(allEvents);
        } else {
            const filteredEvents = allEvents.filter(event => event.mekan === selectedVenue);
            displayEvents(filteredEvents);
        }
    };

    venueFilter.addEventListener('change', filterEvents);

    const init = async () => {
        const events = await fetchEvents();
        if (events) {
            allEvents = events;
            updateVenueFilter(events);
            displayEvents(events);
        }
    };

    init();
}); 

 