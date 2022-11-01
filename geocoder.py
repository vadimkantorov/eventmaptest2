# https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial/en
# https://github.com/OSMNames/OSMNames
# https://osmnames.org/download/

import json
import urllib.parse
import urllib.request

output_path = 'geocoder.json'

url = 'https://query.wikidata.org/sparql'

query = '''

SELECT ?city ?cityLabel ?countryLabel ?iso ?population ?gps
WHERE {
    ?city wdt:P31 wd:Q1549591 . hint:Prior hint:runFirst true .
    ?city wdt:P17 ?country .
    ?city wdt:P1082 ?population .
    ?city wdt:P625 ?gps .
    ?country wdt:P297 ?iso .
    
    FILTER (?population > 100000) .
    
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?population)
LIMIT 5000
'''

print(url.replace('sparql', '#') + urllib.parse.quote(query))
print(output_path)

j = json.loads(urllib.request.urlopen(url + '?' + urllib.parse.urlencode(dict(format = 'json', query = query))).read().decode('utf-8'))
geocoder = {v['cityLabel']['value'] : v['gps']['value'].replace('Point', '').strip('()').replace(' ', ',') for  v in j['results']['bindings']}
json.dump(geocoder, open(output_path, 'w'), indent = 2, sort_keys = True, ensure_ascii = False)
