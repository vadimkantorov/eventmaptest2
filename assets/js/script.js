function choose_random_event()
{
    const eventhashes = Array.from(document.querySelectorAll('a.event:not([data-photohrefs=""])')).map(a => a.dataset.eventhash);
    
    if(eventhashes.length == 1)
        return eventhashes[0];
    
    if(eventhashes.length == 0)
        return '';

    return eventhashes[ Math.floor(eventhashes.length * Math.random()) ];
}

function init_map(id)
{
    const map = L.map(id).setView([20, 0], 2);
    L.tileLayer(decodeURI(document.getElementById('link_tiles').href), {attribution: document.getElementById('map_copyright').outerHTML, maxZoom: 19 }).addTo(map);
    //map.fitBounds(L.latLngBounds(Object.values(data.places).map(place => place.latlng)));
    map.on('popupopen', e =>
    {
        e.popup._closeButton.removeAttribute("href");
        e.popup._closeButton.style.cursor = "pointer";
    });
    return map;
}

function marker_onclick(e)
{
    const _icon = document.querySelector('.circlehighlighted');
    if(_icon != null)
        L.DomUtil.removeClass(_icon, 'circlehighlighted');

    L.DomUtil.addClass(e.target._icon || e.target._path, 'circlehighlighted');

    slideshow_toggle(false);
    window.location.hash = e.target.eventhash;
}

function populate_map(map, events)
{
    let mapmarkers = {};
    for(const a of events)
    {
        // circle-upcoming, circle-past, circle-highlighted
        const marker = L.circleMarker(a.dataset.latlon.split(',').map(parseFloat), {radius: 5, stroke: false, className: a.parentElement.classList.contains('eventactive') ? 'circleupcoming' : 'circlepast'}).addTo(map);
        marker.bindPopup(format_event_popup(a).outerHTML);
        marker.on('click', marker_onclick);

        //marker._icon.id = a.dataset.iconid = a.dataset.eventhash.replace('#', 'marker_icon_');

        marker.eventhash = a.dataset.eventhash;// marker._icon.eventhash =
        mapmarkers[a.dataset.mapmarkerkey] = marker;
    }
    return mapmarkers;
}

function switch_upcoming_campaigns(today_YYYY_MM_DD)
{
    Array.from(document.querySelectorAll('#allcampaigns > .campaign')).filter(li => li.dataset.dateend >= today_YYYY_MM_DD).forEach(li => li.classList.add('campaignactive') || li.classList.remove('campaigninactive'));
}

function switch_upcoming_events(today_YYYY_MM_DD)
{
    Array.from(document.querySelectorAll('.events>li:has(a.event)')).filter(li => li.dataset.date >= today_YYYY_MM_DD).forEach(li => li.classList.add('eventactive') || li.classList.remove('eventinactive'));
}

function populate_upcoming_events_everywhere(today_YYYY_MM_DD)
{
    const lis = Array.from(document.querySelectorAll(`#allevents>li:has(a.event)`)).filter(li => li.dataset.date >= today_YYYY_MM_DD).map(li => li.cloneNode(true));

    const ul = document.getElementById('upcomingeventseverywhere');
    if(ul == null)
        return;

    if(lis.length > 0)
        ul.append(...lis);
    else
        ul.querySelector('li[hidden]').hidden = false;
}

function populate_upcoming_events_in_country(today_YYYY_MM_DD, country)
{
    const lis = Array.from(document.querySelectorAll(`#allevents>li:has(a.event[data-country="${country}"])`)).filter(li => li.dataset.date >= today_YYYY_MM_DD).map(li => li.cloneNode(true));

    document.getElementById('country').innerText = country;

    const ul = document.getElementById('upcomingeventsincountry');
    if(ul == null)
        return;

    if(lis.length > 0)
        ul.append(...lis);
    else
        ul.querySelector('li[hidden]').hidden = false;
}

function format_maps_link(link_pattern_id, event_dataset)
{
    const url_pattern = decodeURI(document.getElementById(link_pattern_id).href);
    return url_pattern.replace('{latlon}', event_dataset.latlon.replace(' ', '')).replace('{name}', event_dataset.city.replace(' ', '+') + ',+' + event_dataset.country.replace(' ', '+'));
}

function format_event_info(a, div = null)
{
    if(div == null)
        div = document.getElementById('info').cloneNode(true);

    div.querySelector('#place_name').innerText = `${a.dataset.city}, ${a.dataset.country}`;
    div.querySelector('#place_date').innerText = `${a.dataset.date} ${a.dataset.time}`;
    div.querySelector('#link_maps_google').href = format_maps_link('link_maps_google_pattern', a.dataset);
    div.querySelector('#link_maps_apple').href = format_maps_link('link_maps_apple_pattern', a.dataset);
    div.querySelector('#eventurl').href = a.dataset.eventurl;
    div.querySelector('#eventurl').className = a.dataset.eventurl == '' ? 'visibilityhidden' : '';
    div.querySelector('#orgurl').href = a.dataset.orgurl;
    div.querySelector('#orgurl').innerText = a.dataset.orgname;
    div.querySelector('#location').innerText = [a.dataset.location, a.dataset.address].filter(s => s != '').join(', ');
    
    div.querySelector('.eventdescription').innerHTML = '';
    div.querySelector('.eventdescription').appendChild(a.querySelector('.eventdescription').firstChild.cloneNode(true));

    const dateall = a.dataset.dateall.split(';');
    const eventhashall = a.dataset.eventhashall.split(';');

    const cur = eventhashall.indexOf(a.dataset.eventhash);
    const prev = dateall.findIndex(date => date < dateall[cur]);
    const next = dateall.findLastIndex(date => date > dateall[cur]);
    

    div.querySelector('#cur').innerText = (next >= 0 ? '<' : '') + dateall[cur] + (prev >= 0 ? '<' : '');
    div.querySelector('#cur').href = eventhashall[cur];
    
    div.querySelector('#next').parentElement.hidden = next == -1;
    if(!div.querySelector('#next').parentElement.hidden)
    {
        div.querySelector('#next').innerText = (next > 0 ? '<' : '') + dateall[next] + '<';
        div.querySelector('#next').href = eventhashall[next];
    }
    
    div.querySelector('#prev').parentElement.hidden = prev == -1;
    if(!div.querySelector('#prev').parentElement.hidden)
    {
        div.querySelector('#prev').innerText = '<' + dateall[prev];
        div.querySelector('#prev').href = eventhashall[prev];
    }
    
    div.querySelector('#dateall').className = dateall.length == 1 ? 'visibilityhidden' : '';

    return div;
}

function format_event_popup(a)
{
    const elem = document.getElementById('popup').content.cloneNode(true);
    elem.querySelector('#place').innerText = `${a.dataset.city}, ${a.dataset.country}`;
    elem.querySelector('#time').innerText = `${a.dataset.date}, ${a.dataset.time}`;
    return elem.firstChild;
}

var slideshow = null;

function slideshow_init(eventhash_list)
{
    document.getElementById('slideshow_toggle').dataset.eventhash = eventhash_list.join(';');
}

function slideshow_toggle(state = null, interval_millis = 7000)
{
    const input = document.getElementById('slideshow_toggle');
    const eventhash = input.dataset.eventhash;
    if(state === false || slideshow != null || eventhash == null || eventhash == '')
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
    hash = (hash == '#undefined' || hash == '#close') ? '' : (hash || '');

    if(hash == '')
        return;

    const img = document.getElementById('eventphoto');
    const info = document.getElementById('info');
    const a = document.querySelector(`a[data-eventhash~="${hash}"]`);

    if(a != null)
    {
        const div = format_event_info(a);
        info.innerHTML = div.innerHTML;
        img.dataset.photohrefs = a.dataset.photohrefs;
        img.dataset.photohrefsidx = '0';
        img.hidden = (img.dataset.photohrefs || '').length == 0;
        img.src = img.hidden ? '' : a.dataset.photohrefs.split(';')[0];
        info.classList.remove('visibilityhidden');

        /*const prev_icon = document.querySelector('.markerhighlighted');
        if(prev_icon != null)
            prev_icon.classList.remove('markerhighlighted');
        const next_icon = document.getElementById(a.dataset.iconid);
        if(next_icon != null)
        {
            next_icon.classList.add('markerhighlighted');
            next_icon.click();
        }*/
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
        slideshow_toggle(false);
        const photohrefs = img.dataset.photohrefs.split(';');
        const photohrefsidx = (1 + parseInt(img.dataset.photohrefsidx)) % photohrefs.length;
        img.src = photohrefs[photohrefsidx];
        img.dataset.photohrefsidx = photohrefsidx;
    }
}
