function switch_upcoming_campaigns(today_YYYY_MM_DD)
{
    Array.from(document.querySelectorAll('#allcampaigns > .campaign')).filter(li => li.dataset.dateend >= today_YYYY_MM_DD).forEach(li => li.classList.add('campaignactive') && li.classList.remove('campaigninactive'));
}

function switch_upcoming_events(today_YYYY_MM_DD)
{
    Array.from(document.querySelectorAll('.events>li:has(a.event')).filter(li => li.dataset.date >= today_YYYY_MM_DD).forEach(li => li.classList.add('eventactive') && li.classList.remove('eventinactive'));
}

function populate_upcoming_events_everywhere(today_YYYY_MM_DD)
{
    const lis = Array.from(document.querySelectorAll(`.events>li:has(a.event)`)).filter(li => li.dataset.date >= today_YYYY_MM_DD);

    document.getElementById('upcomingeventseverywhere').append(...lis);
}

function populate_upcoming_events_in_country(today_YYYY_MM_DD, country)
{
    const lis = Array.from(document.querySelectorAll(`.events>li:has(a.event[data-country="${country}"])`)).filter(li => li.dataset.date >= today_YYYY_MM_DD);

    document.getElementById('country').innerText = country;
    document.getElementById('upcomingeventsincountry').append(...lis);
}

function format_maps_link(link_pattern_id, event_dataset)
{
    const latlng = JSON.parse(event_dataset.latlng);
    const url_pattern = decodeURI(document.getElementById(link_pattern_id).href);
    return url_pattern.replace('{name}', event_dataset.locality.replace(' ', '+') + ',+' + event_dataset.country.replace(' ', '+')).replace('{lat}', latlng[0].toString()).replace('{lng}', latlng[1].toString())
}

function format_event_info(a)
{
    const elem = document.getElementById('info').cloneNode(true);
    elem.querySelector('#place').innerText = `${a.dataset.locality}, ${a.dataset.country}`;
    elem.querySelector('#link_maps_google').href = format_maps_link('link_maps_google_pattern', a.dataset);
    elem.querySelector('#link_maps_apple').href = format_maps_link('link_maps_apple_pattern', a.dataset);
    elem.querySelector('#eventurl').href = a.dataset.eventurl;
    elem.querySelector('#orgurl').href = a.dataset.orgurl;
    elem.querySelector('#orgurl').innerText = a.dataset.orgname;
    elem.querySelector('.eventdescription').innerHTML = '';
    elem.querySelector('.eventdescription').appendChild(a.querySelector('.eventdescription').firstChild.cloneNode(true));
    return elem;
}

function format_event_popup(a)
{
    const elem = document.getElementById('popup').content.cloneNode(true);
    elem.querySelector('#place').innerText = `${a.dataset.locality}, ${a.dataset.country}`;
    elem.querySelector('#time').innerText = `${a.dataset.date}, ${a.dataset.time}`;
    return elem.firstChild;
}


function discover_current_country()
{
    // https://www.techighness.com/post/get-user-country-and-region-on-browser-with-javascript-only/
    const timezone2country = {
        "Europe/Andorra": "Andorra",
        "Asia/Dubai": "United Arab Emirates",
        "Asia/Kabul": "Afghanistan",
        "Europe/Tirane": "Albania",
        "Asia/Yerevan": "Armenia",
        "Antarctica/Casey": "Antarctica",
        "Antarctica/Davis": "Antarctica",
        "Antarctica/Mawson": "Antarctica",
        "Antarctica/Palmer": "Antarctica",
        "Antarctica/Rothera": "Antarctica",
        "Antarctica/Troll": "Antarctica",
        "Antarctica/Vostok": "Antarctica",
        "America/Argentina/Buenos_Aires": "Argentina",
        "America/Argentina/Cordoba": "Argentina",
        "America/Argentina/Salta": "Argentina",
        "America/Argentina/Jujuy": "Argentina",
        "America/Argentina/Tucuman": "Argentina",
        "America/Argentina/Catamarca": "Argentina",
        "America/Argentina/La_Rioja": "Argentina",
        "America/Argentina/San_Juan": "Argentina",
        "America/Argentina/Mendoza": "Argentina",
        "America/Argentina/San_Luis": "Argentina",
        "America/Argentina/Rio_Gallegos": "Argentina",
        "America/Argentina/Ushuaia": "Argentina",
        "Pacific/Pago_Pago": "Samoa (American)",
        "Europe/Vienna": "Austria",
        "Australia/Lord_Howe": "Australia",
        "Antarctica/Macquarie": "Australia",
        "Australia/Hobart": "Australia",
        "Australia/Melbourne": "Australia",
        "Australia/Sydney": "Australia",
        "Australia/Broken_Hill": "Australia",
        "Australia/Brisbane": "Australia",
        "Australia/Lindeman": "Australia",
        "Australia/Adelaide": "Australia",
        "Australia/Darwin": "Australia",
        "Australia/Perth": "Australia",
        "Australia/Eucla": "Australia",
        "Asia/Baku": "Azerbaijan",
        "America/Barbados": "Barbados",
        "Asia/Dhaka": "Bangladesh",
        "Europe/Brussels": "Belgium",
        "Europe/Sofia": "Bulgaria",
        "Atlantic/Bermuda": "Bermuda",
        "Asia/Brunei": "Brunei",
        "America/La_Paz": "Bolivia",
        "America/Noronha": "Brazil",
        "America/Belem": "Brazil",
        "America/Fortaleza": "Brazil",
        "America/Recife": "Brazil",
        "America/Araguaina": "Brazil",
        "America/Maceio": "Brazil",
        "America/Bahia": "Brazil",
        "America/Sao_Paulo": "Brazil",
        "America/Campo_Grande": "Brazil",
        "America/Cuiaba": "Brazil",
        "America/Santarem": "Brazil",
        "America/Porto_Velho": "Brazil",
        "America/Boa_Vista": "Brazil",
        "America/Manaus": "Brazil",
        "America/Eirunepe": "Brazil",
        "America/Rio_Branco": "Brazil",
        "Asia/Thimphu": "Bhutan",
        "Europe/Minsk": "Belarus",
        "America/Belize": "Belize",
        "America/St_Johns": "Canada",
        "America/Halifax": "Canada",
        "America/Glace_Bay": "Canada",
        "America/Moncton": "Canada",
        "America/Goose_Bay": "Canada",
        "America/Toronto": "Canada",
        "America/Nipigon": "Canada",
        "America/Thunder_Bay": "Canada",
        "America/Iqaluit": "Canada",
        "America/Pangnirtung": "Canada",
        "America/Winnipeg": "Canada",
        "America/Rainy_River": "Canada",
        "America/Resolute": "Canada",
        "America/Rankin_Inlet": "Canada",
        "America/Regina": "Canada",
        "America/Swift_Current": "Canada",
        "America/Edmonton": "Canada",
        "America/Cambridge_Bay": "Canada",
        "America/Yellowknife": "Canada",
        "America/Inuvik": "Canada",
        "America/Dawson_Creek": "Canada",
        "America/Fort_Nelson": "Canada",
        "America/Whitehorse": "Canada",
        "America/Dawson": "Canada",
        "America/Vancouver": "Canada",
        "Indian/Cocos": "Cocos (Keeling) Islands",
        "Europe/Zurich": "Switzerland",
        "Africa/Abidjan": "Côte d'Ivoire",
        "Pacific/Rarotonga": "Cook Islands",
        "America/Santiago": "Chile",
        "America/Punta_Arenas": "Chile",
        "Pacific/Easter": "Chile",
        "Asia/Shanghai": "China",
        "Asia/Urumqi": "China",
        "America/Bogota": "Colombia",
        "America/Costa_Rica": "Costa Rica",
        "America/Havana": "Cuba",
        "Atlantic/Cape_Verde": "Cape Verde",
        "Indian/Christmas": "Christmas Island",
        "Asia/Nicosia": "Cyprus",
        "Asia/Famagusta": "Cyprus",
        "Europe/Prague": "Czech Republic",
        "Europe/Berlin": "Germany",
        "Europe/Copenhagen": "Denmark",
        "America/Santo_Domingo": "Dominican Republic",
        "Africa/Algiers": "Algeria",
        "America/Guayaquil": "Ecuador",
        "Pacific/Galapagos": "Ecuador",
        "Europe/Tallinn": "Estonia",
        "Africa/Cairo": "Egypt",
        "Africa/El_Aaiun": "Western Sahara",
        "Europe/Madrid": "Spain",
        "Africa/Ceuta": "Spain",
        "Atlantic/Canary": "Spain",
        "Europe/Helsinki": "Finland",
        "Pacific/Fiji": "Fiji",
        "Atlantic/Stanley": "Falkland Islands",
        "Pacific/Chuuk": "Micronesia",
        "Pacific/Pohnpei": "Micronesia",
        "Pacific/Kosrae": "Micronesia",
        "Atlantic/Faroe": "Faroe Islands",
        "Europe/Paris": "France",
        "Europe/London": "Britain (UK)",
        "Asia/Tbilisi": "Georgia",
        "America/Cayenne": "French Guiana",
        "Europe/Gibraltar": "Gibraltar",
        "America/Nuuk": "Greenland",
        "America/Danmarkshavn": "Greenland",
        "America/Scoresbysund": "Greenland",
        "America/Thule": "Greenland",
        "Europe/Athens": "Greece",
        "Atlantic/South_Georgia": "South Georgia & the South Sandwich Islands",
        "America/Guatemala": "Guatemala",
        "Pacific/Guam": "Guam",
        "Africa/Bissau": "Guinea-Bissau",
        "America/Guyana": "Guyana",
        "Asia/Hong_Kong": "Hong Kong",
        "America/Tegucigalpa": "Honduras",
        "America/Port-au-Prince": "Haiti",
        "Europe/Budapest": "Hungary",
        "Asia/Jakarta": "Indonesia",
        "Asia/Pontianak": "Indonesia",
        "Asia/Makassar": "Indonesia",
        "Asia/Jayapura": "Indonesia",
        "Europe/Dublin": "Ireland",
        "Asia/Jerusalem": "Israel",
        "Asia/Kolkata": "India",
        "Asia/Calcutta": "India",
        "Indian/Chagos": "British Indian Ocean Territory",
        "Asia/Baghdad": "Iraq",
        "Asia/Tehran": "Iran",
        "Atlantic/Reykjavik": "Iceland",
        "Europe/Rome": "Italy",
        "America/Jamaica": "Jamaica",
        "Asia/Amman": "Jordan",
        "Asia/Tokyo": "Japan",
        "Africa/Nairobi": "Kenya",
        "Asia/Bishkek": "Kyrgyzstan",
        "Pacific/Tarawa": "Kiribati",
        "Pacific/Kanton": "Kiribati",
        "Pacific/Kiritimati": "Kiribati",
        "Asia/Pyongyang": "Korea (North)",
        "Asia/Seoul": "Korea (South)",
        "Asia/Almaty": "Kazakhstan",
        "Asia/Qyzylorda": "Kazakhstan",
        "Asia/Qostanay": "Kazakhstan",
        "Asia/Aqtobe": "Kazakhstan",
        "Asia/Aqtau": "Kazakhstan",
        "Asia/Atyrau": "Kazakhstan",
        "Asia/Oral": "Kazakhstan",
        "Asia/Beirut": "Lebanon",
        "Asia/Colombo": "Sri Lanka",
        "Africa/Monrovia": "Liberia",
        "Europe/Vilnius": "Lithuania",
        "Europe/Luxembourg": "Luxembourg",
        "Europe/Riga": "Latvia",
        "Africa/Tripoli": "Libya",
        "Africa/Casablanca": "Morocco",
        "Europe/Monaco": "Monaco",
        "Europe/Chisinau": "Moldova",
        "Pacific/Majuro": "Marshall Islands",
        "Pacific/Kwajalein": "Marshall Islands",
        "Asia/Yangon": "Myanmar (Burma)",
        "Asia/Ulaanbaatar": "Mongolia",
        "Asia/Hovd": "Mongolia",
        "Asia/Choibalsan": "Mongolia",
        "Asia/Macau": "Macau",
        "America/Martinique": "Martinique",
        "Europe/Malta": "Malta",
        "Indian/Mauritius": "Mauritius",
        "Indian/Maldives": "Maldives",
        "America/Mexico_City": "Mexico",
        "America/Cancun": "Mexico",
        "America/Merida": "Mexico",
        "America/Monterrey": "Mexico",
        "America/Matamoros": "Mexico",
        "America/Mazatlan": "Mexico",
        "America/Chihuahua": "Mexico",
        "America/Ojinaga": "Mexico",
        "America/Hermosillo": "Mexico",
        "America/Tijuana": "Mexico",
        "America/Bahia_Banderas": "Mexico",
        "Asia/Kuala_Lumpur": "Malaysia",
        "Asia/Kuching": "Malaysia",
        "Africa/Maputo": "Mozambique",
        "Africa/Windhoek": "Namibia",
        "Pacific/Noumea": "New Caledonia",
        "Pacific/Norfolk": "Norfolk Island",
        "Africa/Lagos": "Nigeria",
        "America/Managua": "Nicaragua",
        "Europe/Amsterdam": "Netherlands",
        "Europe/Oslo": "Norway",
        "Asia/Kathmandu": "Nepal",
        "Pacific/Nauru": "Nauru",
        "Pacific/Niue": "Niue",
        "Pacific/Auckland": "New Zealand",
        "Pacific/Chatham": "New Zealand",
        "America/Panama": "Panama",
        "America/Lima": "Peru",
        "Pacific/Tahiti": "French Polynesia",
        "Pacific/Marquesas": "French Polynesia",
        "Pacific/Gambier": "French Polynesia",
        "Pacific/Port_Moresby": "Papua New Guinea",
        "Pacific/Bougainville": "Papua New Guinea",
        "Asia/Manila": "Philippines",
        "Asia/Karachi": "Pakistan",
        "Europe/Warsaw": "Poland",
        "America/Miquelon": "St Pierre & Miquelon",
        "Pacific/Pitcairn": "Pitcairn",
        "America/Puerto_Rico": "Puerto Rico",
        "Asia/Gaza": "Palestine",
        "Asia/Hebron": "Palestine",
        "Europe/Lisbon": "Portugal",
        "Atlantic/Madeira": "Portugal",
        "Atlantic/Azores": "Portugal",
        "Pacific/Palau": "Palau",
        "America/Asuncion": "Paraguay",
        "Asia/Qatar": "Qatar",
        "Indian/Reunion": "Réunion",
        "Europe/Bucharest": "Romania",
        "Europe/Belgrade": "Serbia",
        "Europe/Kaliningrad": "Russia",
        "Europe/Moscow": "Russia",
        "Europe/Simferopol": "Russia",
        "Europe/Kirov": "Russia",
        "Europe/Volgograd": "Russia",
        "Europe/Astrakhan": "Russia",
        "Europe/Saratov": "Russia",
        "Europe/Ulyanovsk": "Russia",
        "Europe/Samara": "Russia",
        "Asia/Yekaterinburg": "Russia",
        "Asia/Omsk": "Russia",
        "Asia/Novosibirsk": "Russia",
        "Asia/Barnaul": "Russia",
        "Asia/Tomsk": "Russia",
        "Asia/Novokuznetsk": "Russia",
        "Asia/Krasnoyarsk": "Russia",
        "Asia/Irkutsk": "Russia",
        "Asia/Chita": "Russia",
        "Asia/Yakutsk": "Russia",
        "Asia/Khandyga": "Russia",
        "Asia/Vladivostok": "Russia",
        "Asia/Ust-Nera": "Russia",
        "Asia/Magadan": "Russia",
        "Asia/Sakhalin": "Russia",
        "Asia/Srednekolymsk": "Russia",
        "Asia/Kamchatka": "Russia",
        "Asia/Anadyr": "Russia",
        "Asia/Riyadh": "Saudi Arabia",
        "Pacific/Guadalcanal": "Solomon Islands",
        "Indian/Mahe": "Seychelles",
        "Africa/Khartoum": "Sudan",
        "Europe/Stockholm": "Sweden",
        "Asia/Singapore": "Singapore",
        "America/Paramaribo": "Suriname",
        "Africa/Juba": "South Sudan",
        "Africa/Sao_Tome": "Sao Tome & Principe",
        "America/El_Salvador": "El Salvador",
        "Asia/Damascus": "Syria",
        "America/Grand_Turk": "Turks & Caicos Is",
        "Africa/Ndjamena": "Chad",
        "Indian/Kerguelen": "French Southern & Antarctic Lands",
        "Asia/Bangkok": "Thailand",
        "Asia/Dushanbe": "Tajikistan",
        "Pacific/Fakaofo": "Tokelau",
        "Asia/Dili": "East Timor",
        "Asia/Ashgabat": "Turkmenistan",
        "Africa/Tunis": "Tunisia",
        "Pacific/Tongatapu": "Tonga",
        "Europe/Istanbul": "Turkey",
        "Pacific/Funafuti": "Tuvalu",
        "Asia/Taipei": "Taiwan",
        "Europe/Kiev": "Ukraine",
        "Europe/Uzhgorod": "Ukraine",
        "Europe/Zaporozhye": "Ukraine",
        "Pacific/Wake": "US minor outlying islands",
        "America/New_York": "United States",
        "America/Detroit": "United States",
        "America/Kentucky/Louisville": "United States",
        "America/Kentucky/Monticello": "United States",
        "America/Indiana/Indianapolis": "United States",
        "America/Indiana/Vincennes": "United States",
        "America/Indiana/Winamac": "United States",
        "America/Indiana/Marengo": "United States",
        "America/Indiana/Petersburg": "United States",
        "America/Indiana/Vevay": "United States",
        "America/Chicago": "United States",
        "America/Indiana/Tell_City": "United States",
        "America/Indiana/Knox": "United States",
        "America/Menominee": "United States",
        "America/North_Dakota/Center": "United States",
        "America/North_Dakota/New_Salem": "United States",
        "America/North_Dakota/Beulah": "United States",
        "America/Denver": "United States",
        "America/Boise": "United States",
        "America/Phoenix": "United States",
        "America/Los_Angeles": "United States",
        "America/Anchorage": "United States",
        "America/Juneau": "United States",
        "America/Sitka": "United States",
        "America/Metlakatla": "United States",
        "America/Yakutat": "United States",
        "America/Nome": "United States",
        "America/Adak": "United States",
        "Pacific/Honolulu": "United States",
        "America/Montevideo": "Uruguay",
        "Asia/Samarkand": "Uzbekistan",
        "Asia/Tashkent": "Uzbekistan",
        "America/Caracas": "Venezuela",
        "Asia/Ho_Chi_Minh": "Vietnam",
        "Pacific/Efate": "Vanuatu",
        "Pacific/Wallis": "Wallis & Futuna",
        "Pacific/Apia": "Samoa (western)",
        "Africa/Johannesburg": "South Africa",
        "America/Antigua": "Antigua & Barbuda",
        "America/Anguilla": "Anguilla",
        "Africa/Luanda": "Angola",
        "Antarctica/McMurdo": "Antarctica",
        "Antarctica/DumontDUrville": "Antarctica",
        "Antarctica/Syowa": "Antarctica",
        "America/Aruba": "Aruba",
        "Europe/Mariehamn": "Åland Islands",
        "Europe/Sarajevo": "Bosnia & Herzegovina",
        "Africa/Ouagadougou": "Burkina Faso",
        "Asia/Bahrain": "Bahrain",
        "Africa/Bujumbura": "Burundi",
        "Africa/Porto-Novo": "Benin",
        "America/St_Barthelemy": "St Barthelemy",
        "America/Kralendijk": "Caribbean NL",
        "America/Nassau": "Bahamas",
        "Africa/Gaborone": "Botswana",
        "America/Blanc-Sablon": "Canada",
        "America/Atikokan": "Canada",
        "America/Creston": "Canada",
        "Africa/Kinshasa": "Congo (Dem. Rep.)",
        "Africa/Lubumbashi": "Congo (Dem. Rep.)",
        "Africa/Bangui": "Central African Rep.",
        "Africa/Brazzaville": "Congo (Rep.)",
        "Africa/Douala": "Cameroon",
        "America/Curacao": "Curaçao",
        "Europe/Busingen": "Germany",
        "Africa/Djibouti": "Djibouti",
        "America/Dominica": "Dominica",
        "Africa/Asmara": "Eritrea",
        "Africa/Addis_Ababa": "Ethiopia",
        "Africa/Libreville": "Gabon",
        "America/Grenada": "Grenada",
        "Europe/Guernsey": "Guernsey",
        "Africa/Accra": "Ghana",
        "Africa/Banjul": "Gambia",
        "Africa/Conakry": "Guinea",
        "America/Guadeloupe": "Guadeloupe",
        "Africa/Malabo": "Equatorial Guinea",
        "Europe/Zagreb": "Croatia",
        "Europe/Isle_of_Man": "Isle of Man",
        "Europe/Jersey": "Jersey",
        "Asia/Phnom_Penh": "Cambodia",
        "Indian/Comoro": "Comoros",
        "America/St_Kitts": "St Kitts & Nevis",
        "Asia/Kuwait": "Kuwait",
        "America/Cayman": "Cayman Islands",
        "Asia/Vientiane": "Laos",
        "America/St_Lucia": "St Lucia",
        "Europe/Vaduz": "Liechtenstein",
        "Africa/Maseru": "Lesotho",
        "Europe/Podgorica": "Montenegro",
        "America/Marigot": "St Martin (French)",
        "Indian/Antananarivo": "Madagascar",
        "Europe/Skopje": "North Macedonia",
        "Africa/Bamako": "Mali",
        "Pacific/Saipan": "Northern Mariana Islands",
        "Africa/Nouakchott": "Mauritania",
        "America/Montserrat": "Montserrat",
        "Africa/Blantyre": "Malawi",
        "Africa/Niamey": "Niger",
        "Asia/Muscat": "Oman",
        "Africa/Kigali": "Rwanda",
        "Atlantic/St_Helena": "St Helena",
        "Europe/Ljubljana": "Slovenia",
        "Arctic/Longyearbyen": "Svalbard & Jan Mayen",
        "Europe/Bratislava": "Slovakia",
        "Africa/Freetown": "Sierra Leone",
        "Europe/San_Marino": "San Marino",
        "Africa/Dakar": "Senegal",
        "Africa/Mogadishu": "Somalia",
        "America/Lower_Princes": "St Maarten (Dutch)",
        "Africa/Mbabane": "Eswatini (Swaziland)",
        "Africa/Lome": "Togo",
        "America/Port_of_Spain": "Trinidad & Tobago",
        "Africa/Dar_es_Salaam": "Tanzania",
        "Africa/Kampala": "Uganda",
        "Pacific/Midway": "US minor outlying islands",
        "Europe/Vatican": "Vatican City",
        "America/St_Vincent": "St Vincent",
        "America/Tortola": "Virgin Islands (UK)",
        "America/St_Thomas": "Virgin Islands (US)",
        "Asia/Aden": "Yemen",
        "Indian/Mayotte": "Mayotte",
        "Africa/Lusaka": "Zambia",
        "Africa/Harare": "Zimbabwe"
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone2country[timezone];
}

var slideshow = null;

function slideshow_init(eventhash_list)
{
    document.getElementById('slideshow_toggle').dataset.eventhash = eventhash_list.join(';');
}

function slideshow_toggle(stop, interval_millis = 7000)
{
    const input = document.getElementById('slideshow_toggle');
    const eventhash = input.dataset.eventhash;
    if(stop == true || slideshow != null || eventhash == null || eventhash == '')
    {
        slideshow = clearInterval(slideshow);
        input.checked = false;
    }
    else
    {
        slideshow = slideshow_tick() || setInterval(slideshow_tick, interval_millis);
        input.checked = true;
    }
}

function slideshow_tick()
{
    const img = document.getElementById('eventphoto');
    const input = document.getElementById('slideshow_toggle');
    
    const photohrefs = img.dataset.photohrefs.split(';');
    const photohrefsidx = img.dataset.photohrefsidx != '' ? 1 + parseInt(img.dataset.photohrefsidx) : '0';
    if(img.dataset.photohrefs != '' && photohrefsidx < photohrefs.length)
    {
        img.src = photohrefs[photohrefsidx];
        img.dataset.photohrefsidx = photohrefsidx.toString();
    }
    else
    {
        const hash = input.dataset.eventhash.split(';');
        input.dataset.eventidx = (input.dataset.eventidx == '' ? 0 : (1 + parseInt(input.dataset.eventidx)) % hash.length).toString();
        navigate(hash[parseInt(input.dataset.eventidx)]);
    }

    img.hidden = false;
}

function navigate(hash)
{
    hash = hash || '';
    
    const img = document.getElementById('eventphoto');
    const info = document.getElementById('info');
    const a = document.querySelector(`a[data-hash~="${hash}"]`); 
    
    if(a != null)
    {
        const div = format_event_info(a);
        info.innerHTML = div.innerHTML;
        img.dataset.photohrefs = a.dataset.photohrefs;
        img.dataset.photohrefsidx = '0';
        img.hidden = (img.dataset.photohrefs || '').length == 0;
        img.src = img.hidden ? '' : a.dataset.photohrefs.split(';')[0];
        info.classList.remove('visibilityhidden');

        const prev_icon = document.querySelector('.markerhighlighted');
        if(prev_icon != null)
            prev_icon.classList.remove('markerhighlighted');
        
        const next_icon = document.getElementById(a.dataset.iconid);
        if(next_icon != null)
            next_icon.classList.add('markerhighlighted');
    }
    else
    {
        img.hidden = true;
        info.classList.add('visibilityhidden');
    }
}

function img_onclick()
{
    const img = document.getElementById('eventphoto');
    if(!img.hidden)
    {
        slideshow_toggle(true);
        const photohrefs = img.dataset.photohrefs.split(';');
        const photohrefsidx = (1 + parseInt(img.dataset.photohrefsidx)) % photohrefs.length;
        img.src = photohrefs[photohrefsidx];
        img.dataset.photohrefsidx = photohrefsidx;
    }
}
