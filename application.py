from flask import Flask, render_template, json
from dotenv import load_dotenv
import requests
import os
import collections

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template('index.html')
