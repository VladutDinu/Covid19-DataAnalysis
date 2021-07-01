import json
from logging import debug
from threading import Thread
from time import strptime
from typing import Optional
import requests
from datetime import datetime, timedelta
import uvicorn
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from requests.api import request
from pymongo import MongoClient
from bson.objectid import ObjectId
from pprint import pprint
REQUEST_URL = 'https://api.covid19api.com/live/country/Romania/status/{}/date/{}'
TYPES=['Active', 'Recovered', 'Deaths']
LAST_DATE = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
link =''
with open('link.txt', 'r') as file:
    link = file.read()
CLIENT = MongoClient(link)
DB = CLIENT.Covid19
app = FastAPI()
origins = ["*"]

cases={}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_async_data(url, status):
    data = requests.get(url).json()
    cases.update({status:[]})
    for index in range(1, len(data)):
        cases[status].append({"argument": index, "value": data[index][status] - data[index-1][status] if data[index][status] - data[index-1][status] > 0 
                               and data[index][status] - data[index-1][status] < 20000 else 0})
    

def get(date):
    threads=[]
    for status in TYPES:
        threads.append(Thread(target=get_async_data, args=[REQUEST_URL.format(status, date), status]))
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join() 


@app.on_event("startup")
async def startup_event():
    date = ''
    with open('last_date.txt', 'r') as file:
        date = file.read()
    date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    modified_date = date + timedelta(days=-1)
    if (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')>= modified_date.strftime('%Y-%m-%d').split('T')[0]: 
        get(modified_date)
        for status in TYPES:
            for case in cases[status]:
                print(case)
                result=DB.data.update_one({"_id" : ObjectId("66f41c59563c515949645d85")}, 
                                          { '$push': 
                                                  { 
                                                     status: case, 
                                                   } 
                                          })  
        with open('last_date.txt', 'w') as file:
            file.write(LAST_DATE)     

@app.get("/getCases")
def getActiveCases(cases_type: str):
    data = CLIENT.Covid19.data.find()
    contents=[]
    for x in data:
        contents.append(x[cases_type])
    return JSONResponse(status_code=200, content=contents)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
