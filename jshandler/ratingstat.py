from flask import Flask, url_for
from flask import request, after_this_request
from flask import render_template, make_response
from flask_cors import CORS, cross_origin

import time
import pandas as pd
import requests

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/rating/5sec')
@cross_origin()
def index():
    request.args.get('program')
    request.args.get('episode')

    start_time = time.time()
    response = requests.get("http://localhost:3000/api/ViewData")
    df_new = pd.DataFrame.from_records(response.json())
    df_new2 = df_new
    df = pd.concat([df_new,df_new2])
    df.reset_index(drop=True, inplace=True)
    df.loc[0:100,'title']='KnowingBros-300th'
    df.uptime = (df.uptime // 5) *5
    result = df.groupby(['title','uptime']).size()['KnowingBros-300th'].values
    print(result)
    result2 = list(result)
    result2.extend([4,5,2,5,9])
    aa = list(result2)
    aa.reverse()
    print(time.time() - start_time)
    return str([result2,aa])

