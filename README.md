# Hourly Weather (PWA)

A friendly hourly forecast from the National Weather Service for 41.6005, -93.6091 (Des Moines, IA).

Data sources (no API keys needed):
- National Weather Service (`api.weather.gov` & `radar.weather.gov`): hourly forecast
  (the same data as the forecast.weather.gov digital page), feels-like, gusts,
  rain/snow amounts, alerts, the latest airport observation, and live precipitation radar
  (local station loop or frame-by-frame scrubber).
- Open-Meteo: air quality, UV index, 15-minute rain outlook, place search.

## Put it online (needs HTTPS for install)

Any static host works. Two easy free options:

- **Netlify Drop:** open https://app.netlify.com/drop and drag this folder onto the page.
- **GitHub Pages:** create a repo, upload these files, then go to Settings → Pages → deploy from the `main` branch.

## Install on your phone

- **iPhone (Safari):** open the site → Share → **Add to Home Screen**.
- **Android (Chrome):** open the site → tap **Install app** at the bottom of the page, or ⋮ → **Install app**.

## Locations

Tap the place name at the top to search a city or ZIP, pick a saved place, or
choose **Current location** (follows you each time you open the app). You can
also add `?lat=…&lon=…` to the address, or change `DEFAULT_PLACE` near the top
of the script in `index.html`. NWS forecasts cover US locations only.

## Files

- `index.html`: the whole app (layout, styles, script)
- `manifest.webmanifest`: app name, colors, icons
- `sw.js`: service worker that keeps the app working offline
- `icon-*.png`, `apple-touch-icon.png`: home screen icons
