from flask import Flask, render_template, json
from dotenv import load_dotenv
import requests
import os
import collections

load_dotenv('.env')

app = Flask(__name__)
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SECRET_KEY=os.environ['SECRET_KEY'],
)


@app.route("/")
def home():
    state, total = get_USA_cases()
    news = get_news()
    timeline = get_history()

    return render_template('home.html', states=state, total=total, news=news, timeline=timeline)


@app.route("/world")
def world():
    countries, world_total, world_map = get_world_cases()

    return render_template('world.html', countries=countries, world_total=world_total, world_map=world_map)


def get_USA_cases():
    """ Return COVID cases by States and total cases in the U.S. """

    CASE_URL = 'https://corona.lmao.ninja/'
    state = total = {}

    if requests.get(CASE_URL).status_code == 200:
        res_state = requests.get(CASE_URL + 'v2/states')
        state = json.loads(res_state.text)

        res_usa = requests.get(CASE_URL + 'v2/countries/us')
        total = json.loads(res_usa.text)

        # clean up States data
        outside = {
            'Wuhan Repatriated': 0,
            'Diamond Princess Cruise': 0,
            'United States Virgin Islands': 0,
            'Puerto Rico': 0,
            'Northern Mariana Islands': 0,
            'Guam': 0,
            'Navajo Nation': 0,
            'Grand Princess Ship': 0,
            'Diamond Princess Ship': 0
        }

        for i in range(len(state)-1, -1, -1):
            if state[i]['state'] in outside:
                del state[i]

    return state, total


def get_news():
    """ Return top news results relate to Coronavirus """

    # load_dotenv('.env')
    API_KEY = os.environ['API_KEY']
    NEWS_URL = ('http://newsapi.org/v2/top-headlines?q=coronavirus&language=en&country=us&pageSize=10&sortBy=popularity&apiKey='+API_KEY)

    res_news = requests.get(NEWS_URL)

    if res_news.status_code == 200:
        news = json.loads(res_news.text)
        # remove news source at the end
        for i in range(len(news['articles'])):
            news['articles'][i]['title'] = news['articles'][i]['title'].split(
                ' - ')[0]
        # modify source name to match clearbit logo API
        for link in news['articles']:
            source = link['url'].split('/')[2]
            link['source']['name'] = source.replace('www.', '')
    else:
        news = {}

    return news


def get_history():
    """ Return US historical timeline """

    URL = 'https://corona.lmao.ninja/v2/historical/us'

    res_history = requests.get(URL)
    timeline = json.loads(res_history.text)

    weekly = collections.Counter(timeline['timeline']['cases']).most_common(8)
    weekly.reverse()

    threshold = {}
    date = [weekly[i][0] for i in range(1, len(weekly))]
    cases = []
    diff = weekly[0][1]

    for i in range(1, len(weekly)):
        cases.append(weekly[i][1] - diff)
        diff = weekly[i][1]

    threshold['date'] = date
    threshold['cases'] = cases

    return threshold


def get_world_cases():
    """ Return COVID cases worldwide """

    URL = 'https://corona.lmao.ninja/'
    countries = world_total = {}

    if requests.get(URL).status_code == 200:
        res_countries = requests.get(URL + 'v2/countries')
        countries = json.loads(res_countries.text)
        countries = sorted(countries, key=lambda d: d['cases'], reverse=True)

        res_total = requests.get(URL + 'v2/all')
        world_total = json.loads(res_total.text)

    # map data to match JS map library for displaying circle image and tooltip on countries
    world_map = []
    for data in countries:
        world_map.append({
            'title': data['country'],
            'latitude': data['countryInfo']['lat'],
            'longitude': data['countryInfo']['long'],
            'cases': data['cases'],
            'recovered': data['recovered'],
            'deaths': data['deaths']
        })

    return countries, world_total, world_map
