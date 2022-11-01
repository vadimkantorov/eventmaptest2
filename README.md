# EventMap
**EventMap** is a website generator for showcasing real-world events/demonstrations driven by a common goal or a theme, along with a map and posted photos.

**EventMap** is based on [Jekyll](https://jekyllrb.com/) static website generator, and the events are described in YAML-like files following a specific directory structure. **EventMap** website generation can be run and served by [GitHub Pages](https://pages.github.com/).

An event map consists of the main page and of campaign pages. Each campaign consists of multiple events. The main page lists all events from all campaigns.

 Below are described the file formats and the directory structure providing information about campaigns, events and the main page.

## Campaign pages
`data/campaigns/2022-my-campaign-name-for-url/2022-my-campaign-name-for-url.md`:
```yaml
---
title: campaign page header text
logo:  main page logo, absolute https-path or file path relative to data/index/ e.g. index.jpg would refer to data/index/index.jpg 
date: # one date in YYYY-MM-DD format or array of two dates
  - 2022-02-20
  - 2022-11-28

organizers: # array of following records
  - orgname: name of organizer
    orgurl: https-url of organizer announcement on the web or social media
    country: country name where an organizer is working, the same organizer may be included multiple times for different countries
    city: city name (optional)
# - orgname: ...
#   orgurl: ...
#   ...

events: # array of following records
  - city: Yerevan
    country: Armenia
    address: Freedom Square
    date: 2022-09-27
    time: "15:00"
    eventurl: https://t.me/freeyerevan/205
    orgname: Протесты в Ереване
    orgurl: https://t.me/freeyerevan
    photos: photos/photo1.jpg; photos/photo2.jpg

  - city: Yerevan
    country: Armenia
    address: Freedom Square
    date: 2022-09-27
    time: "15:00"
    eventurl: https://t.me/freeyerevan/205
    orgname:
      - org1
      - org2
    orgurl: 
      - https://org1.com
      - https://org2.com
    photos:
      - photos/photo1.jpg
      - photos/photo2.jpg

# - city: ...
#   address: ...
#   date: ...
  
---
(markdown) campaign page intro text
```

## Main page
`data/index/index.md`:
```yaml
---
title: same as for campaign pages
logo:  same as for campaign pages 
---
(markdown) same as for campaign pages
```

In general, main page file format is same as for campaign pages, but the paths are computed relative to `data/index/` instead of `data/campaigns/my-campaign-name`.


## Event info

## Geocoding information
`assets/geocoder.json`:
```json
{
    "London": "51.5073219,-0.1276474",
    "Paris": "48.8588897,2.3200410217200766"
}
```

Crude geocoding based on city is used if an event doesn't provide custom GPS coordinates. The geocoding JSON file was originally generated by `python3 geocoder.py > assets/geocoder.json`.

## Style customization
A single CSS file `_includes/style.css` specifies all styles and can be modified for style customization.

## Example directory structure
```
./assets/geocoder.json
./data/campaigns/
./data/index/index.md
./data/index/index.jpg
./data/campaigns/ABC/ABC.md
./data/campaigns/ABC/ABC.jpg
./data/campaigns/ABC/photos/EFG.jpg
```

## TODO
```
- photo crops
- link for adding custom events
```
