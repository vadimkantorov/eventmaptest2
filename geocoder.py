# https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial/en

import json
import urllib.parse
import urllib.request

url = 'https://query.wikidata.org/sparql'

query = '''

SELECT ?city ?cityLabel ?countryLabel ?iso ?population
WHERE {
  ?city wdt:P31 wd:Q1549591 . hint:Prior hint:runFirst true .
  ?city wdt:P17 ?country .
  ?country wdt:P297 ?iso .

  	?city wdt:P1082 ?population .
  FILTER (?population > 100000) .
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?population)
LIMIT 10
'''

print(url.replace('sparql', '#') + urllib.parse.quote(query))

j = json.loads(urllib.request.urlopen(url + '?' + urllib.parse.urlencode(dict(format = 'json', query = query))).read().decode('utf-8'))

geocoder = {v['cityLabel']['value'] : v['population']['value'] for  v in j['results']['bindings']}

json.dump(geocoder, open('geocoder.json', 'w'), indent = 2, sort_keys = True, ensure_ascii = False)
