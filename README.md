## TODO
```
- photo crops
- link for adding custom events
```

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

## Main page
`data/index/index.md`:
```
---
title: (string) main page header
logo: (string) absolute https-path or file path relative to data/index/ where images can be stored
---
(markdown) main page intro text
```

## Campaign pages
`data/campaigns/2022-my-campaign-name-for-url/2022-my-campaign-name-for-url.md`:
```
---
title: (string)
date: 
 - 2022-02-20
 - 2022-11-28
logo: 2022-stopmurderization.jpg
```
