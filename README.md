# Balıkesir Etkinlikleri

Balıkesir'deki tüm etkinlikleri listeleyen ve filtreleme yapabilen bir web uygulaması.

## Özellikler

- Tüm etkinlikleri görüntüleme
- Mekana göre filtreleme
- Takvim görünümü ile etkinlikleri tarihlerine göre görüntüleme
- Açılır/kapanır takvim paneli
- Her etkinlik için kalan koltuk sayısı bilgisi
- Görsel hover efektleri
- Responsive tasarım
- Bilet satın alma bağlantıları

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/HakanYilmazzz/BBBEvent.git
```

2. `config.example.js` dosyasını `config.js` olarak kopyalayın:
```bash
cp config.example.js config.js
```

3. `config.js` dosyasını kendi API bilgilerinizle güncelleyin:
```javascript
const config = {
    API_URL: 'API_URL',
    PROXY_URL: 'PROXY_URL',
    IMAGE_BASE_URL: 'IMAGE_BASE_URL',
    SITE_BASE_URL: 'SITE_BASE_URL'
};
```

4. Projeyi bir web sunucusunda çalıştırın (örneğin Live Server).

## Kullanılan Teknolojiler

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Fetch API
- CORS Proxy

## Ekran Görüntüleri

- Takvim Görünümü: Etkinlikleri tarih bazlı görüntüleme
- Kart Görünümü: Tüm etkinlikleri grid yapısında listeleme
- Filtre: Mekana göre etkinlikleri filtreleme
- Koltuk Durumu: Her etkinlik için anlık koltuk durumu

## Özellik Detayları

### Takvim Özellikleri
- Ay ay gezinme
- Etkinlik olan günlerin işaretlenmesi
- Gün bazlı etkinlik listesi
- Açılır/kapanır panel yapısı

### Kart Özellikleri
- Etkinlik görseli
- Etkinlik adı ve detayları
- Tarih ve saat bilgisi
- Mekan bilgisi
- Kalan koltuk sayısı
- Bilet alma bağlantısı

### Filtreleme
- Mekana göre filtreleme
- Tüm mekanları listeleme
- Anlık filtreleme

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 