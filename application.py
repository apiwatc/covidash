from flask import Flask, render_template, json
from dotenv import load_dotenv
import requests
import os
import collections

app = Flask(__name__)


@app.route("/")
def hello():
    state, usa = get_cases()
    news = get_news()
    timeline = get_history()

    return render_template('index.html', states=state, total=usa, news=news, timeline=timeline)


def get_cases():
    """ Return COVID cases by States and total cases in the U.S. """

    CASE_URL = 'https://corona.lmao.ninja/'

    if requests.get(CASE_URL).status_code == 200:
        res_state = requests.get(CASE_URL + 'v2/states')
        state = json.loads(res_state.text)

        res_usa = requests.get(CASE_URL + 'v2/countries/us')
        usa = json.loads(res_usa.text)

        # clean up data
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
    else:
        state, usa = {}, {}

    return state, usa


def get_news():
    """ Return top news results relate to Coronavirus """

    # load_dotenv('.env')
    # key = os.environ['apiKey']
    NEWS_URL = ('http://newsapi.org/v2/top-headlines?'
                'q=coronavirus&'
                'language=en&'
                'country=us&'
                'pageSize=10&'
                'sortBy=popularity&'
                'apiKey=8733c94151784006a710bb1608cdc79f')

    res_news = requests.get(NEWS_URL)

    if res_news.status_code == 200:
        news = json.loads(res_news.text)
        # remove news source at the end
        for i in range(len(news['articles'])):
            news['articles'][i]['title'] = news['articles'][i]['title'].split(
                ' - ')[0]
    else:
        news = {}

    return news


def get_history():
    URL = 'https://corona.lmao.ninja/v2/historical/us'

    res_history = requests.get(URL)
    timeline = json.loads(res_history.text)

    # for k, v in timeline['timeline']['cases'].items():
    #     timeline['timeline']['cases'][k] = f'{v:,}'
    weekly = collections.Counter(timeline['timeline']['cases']).most_common(7)
    weekly.reverse()

    return dict(weekly)
