document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const loadingElement = document.getElementById('loading');
    const venueFilter = document.getElementById('venue-filter');
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('currentMonth');
    const selectedDateEvents = document.getElementById('selected-date-events');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const toggleCalendarBtn = document.getElementById('toggleCalendar');
    const calendarSection = document.querySelector('.calendar-section');

    let allEvents = [];
    let currentDate = new Date();
    let selectedDate = null;

    // Takvimi aç/kapat
    toggleCalendarBtn.addEventListener('click', () => {
        calendarSection.classList.toggle('collapsed');
        toggleCalendarBtn.classList.toggle('active');
    });

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
            const seatStatus = event.KoltukKontrol > 0 
                ? `<span class="seat-count available">${event.KoltukKontrol} koltuk kaldı</span>`
                : '<span class="seat-count sold-out">Tüm koltuklar doldu</span>';
            
            eventCard.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${event.etkinlik}" class="event-image" onerror="this.src='https://via.placeholder.com/300x200?text=Görsel+Bulunamadı'">
                    <div class="image-overlay"></div>
                </div>
                <div class="event-info">
                    <h2 class="event-title">${event.etkinlik}</h2>
                    <p class="event-date">${event.tarih} - ${event.saat}</p>
                    <p class="event-venue">${event.mekan}</p>
                    ${seatStatus}
                    <a href="${config.SITE_BASE_URL}/tr-tr/${event.tipForUrl}/${event.url}" target="_blank" class="event-link">Bilet Al</a>
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

    const getEventsForDate = (date) => {
        return allEvents.filter(event => {
            const eventDate = new Date(event.SeanceDate);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const updateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Ay adını güncelle
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;

        // Ayın ilk gününü ve toplam gün sayısını hesapla
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();

        // Takvim grid'ini oluştur
        let calendarHTML = '';
        
        // Boş günleri ekle (Pazartesi = 1, Pazar = 0)
        let firstDayOfWeek = firstDay.getDay() || 7;
        for (let i = 1; i < firstDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Günleri ekle
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const events = getEventsForDate(date);
            const hasEvents = events.length > 0;
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            calendarHTML += `
                <div class="calendar-day ${hasEvents ? 'has-event' : ''} ${isSelected ? 'selected' : ''}" 
                     data-date="${date.toISOString()}">
                    ${day}
                    ${hasEvents ? `
                        <div class="event-dot"></div>
                        <div class="event-count">${events.length} etkinlik</div>
                    ` : ''}
                </div>
            `;
        }

        calendarDays.innerHTML = calendarHTML;

        // Gün tıklama olaylarını ekle
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                const date = new Date(day.dataset.date);
                selectedDate = date;
                const events = getEventsForDate(date);
                
                // Seçili günü güncelle
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');

                // Seçili gün etkinliklerini göster
                if (events.length > 0) {
                    selectedDateEvents.innerHTML = `
                        <h3>${day.textContent.split('\n')[0]} ${monthNames[month]} ${year}</h3>
                        ${events.map(event => `
                            <div class="event-mini-card">
                                <div class="event-mini-title">${event.etkinlik}</div>
                                <div class="event-mini-info">
                                    ${event.saat} - ${event.mekan}
                                </div>
                            </div>
                        `).join('')}
                    `;
                    selectedDateEvents.classList.add('show');
                } else {
                    selectedDateEvents.innerHTML = `
                        <h3>${day.textContent.split('\n')[0]} ${monthNames[month]} ${year}</h3>
                        <p>Bu tarihte etkinlik bulunmuyor.</p>
                    `;
                    selectedDateEvents.classList.add('show');
                }
            });
        });
    };

    // Ay değiştirme olayları
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    venueFilter.addEventListener('change', filterEvents);

    const init = async () => {
        const events = await fetchEvents();
        if (events) {
            allEvents = events;
            updateVenueFilter(events);
            displayEvents(events);
            updateCalendar();
        }
    };

    init();
}); 

 