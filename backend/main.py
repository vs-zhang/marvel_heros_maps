from flask import Flask, request
from time import time
import requests
import hashlib
import json
import redis
from Queue import Queue
from threading import Thread
from flask import jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
r = redis.StrictRedis(host='localhost', port=6379, db=0)

MARVEL_PUBLIC_KEY = '0e27226a0590199eee20885e431fd83f'
MARVEL_PRIVATE_KEY = '29b6716e01c1e0536ae8b846a7a2cccb3f0a886f'
MARVEL_URL = 'https://gateway.marvel.com:443/v1/public'
LIMIT = 100
TOTAL_HEROES = 1485

heroes = []
top_heroes = []
top_heroes_locations_memo = {}

LOCATIONS = {
    "NYC": [40.730610, -73.935242],
    "Boston": [42.364506, -71.038887],
    "DC": [38.894207, -77.035507],
    "Chicago": [41.881832, -87.623177],
    "Indianapolis": [39.832081, -86.145454],
    "LA": [34.052235, -118.243683],
    "SF": [37.733795, -122.446747],
    "Dallas": [32.897480, -97.040443],
    "Denver": [39.742043, -104.991531],
    "Seattle": [47.608013, -122.335167],
    "New Orleans": [29.951065, -90.071533],
    "Orlando": [28.538336, -81.379234],
    "Baltimore": [39.299236, -76.609383],
    "Minneapolis": [44.986656, -93.258133],
    "Cleveland": [41.505493, -81.681290]
}

CITIES = [
    "NYC",
    "Boston",
    "DC",
    "Chicago",
    "Indianapolis",
    "LA",
    "SF",
    "Dallas",
    "Denver",
    "Seattle",
    "New Orleans",
    "Orlando",
    "Baltimore",
    "Minneapolis",
    "Cleveland"
]


def get_heroes_from_marvel(offset=0):
    ts = str(round(time()))
    st = ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY
    m = hashlib.md5()
    m.update(st)
    h = m.hexdigest()
    url = '{}/{}?orderBy=name&ts={}&apikey={}&hash={}&limit={}&offset={}'.format(MARVEL_URL, 'characters', ts,
                                                                                 MARVEL_PUBLIC_KEY, h, LIMIT, offset)
    res = requests.get(url)
    json_data = json.loads(res.content)
    return json_data['data']['results']


class DownloadWorker(Thread):
    def __init__(self, queue, result):
        Thread.__init__(self)
        self.queue = queue
        self.result = result

    def run(self):
        while True:
            offset = self.queue.get()
            self.result += get_heroes_from_marvel(offset)
            self.queue.task_done()


def get_top_heroes(num):
    heroes = []
    queue = Queue()
    ts = time()
    for x in range(TOTAL_HEROES / LIMIT + 1):
        worker = DownloadWorker(queue, heroes)
        worker.daemon = True
        worker.start()

    for i in range(TOTAL_HEROES / LIMIT + 1):
        queue.put(i * LIMIT)
    queue.join()
    print('Took {} Seconds'.format(time() - ts))
    top_heroes = sorted(heroes, key=lambda x: x['comics']['available'], reverse=True)[:num]
    return top_heroes


def send_heroes_to_cities():
    for idx, city in enumerate(CITIES):
        top_heroes_locations_memo[city] = top_heroes[idx]

def cache_locations(LOCATIONS):
    for city  , location in LOCATIONS.iteritems():
        r.geoadd('us_major_cities_locations', location[1], location[0], city)

@app.route("/nearby_heroes")
@cross_origin()
def around():
    # should raise error when missing params, just use boston and 500 mi as default for the coding assignment
    long = request.args.get('longitude', -71.038887)
    lat = request.args.get('latitude', 42.364506)
    radius = request.args.get('radius', 500)
    unit = request.args.get('unit', 'mi')
    near_by_cities = r.georadius('us_major_cities_locations', long, lat, radius, unit=unit, withdist=True, withcoord=True, sort='ASC')
    result = []
    if near_by_cities:
        for city, dist, coordinate in near_by_cities:
            temp = {}
            hero = top_heroes_locations_memo[city]
            temp['name'] = hero['name']
            temp['thumbnail'] = '{}.{}'.format(hero['thumbnail']['path'], hero['thumbnail']['extension'])
            temp['cityname'] = city
            temp['distance'] = dist
            temp['coordinate'] = coordinate
            result.append(temp)
    return jsonify(result)


if __name__ == "__main__":
    cached_top_heroes = r.get('top_heroes')
    if cached_top_heroes:
        top_heroes = json.loads(cached_top_heroes)
    else:
        top_heroes = get_top_heroes(15)
        r.set('top_heroes', json.dumps(top_heroes))
    send_heroes_to_cities()
    if not r.exists('us_major_cities_locations'):
        cache_locations(LOCATIONS)
    app.run()
