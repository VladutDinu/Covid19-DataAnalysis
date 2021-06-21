from typing import Optional
import requests
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
                                                   
@app.get("/getActiveCases")
def getActiveCases():
    data = requests.get('https://api.covid19api.com/country/Romania').json()
    active_cases=[]
    for index in range(1, len(data)):
        active_cases.append({"argument": index, "value": data[index]['Active'] - data[index-1]['Active'] if data[index]['Active'] - data[index-1]['Active'] > 0 and data[index]['Active'] - data[index-1]['Active'] < 10000 else 0})
    return JSONResponse(status_code=200, content=active_cases)

@app.get("/getRecoveredCases")
def getRecoveredCases():
    data = requests.get('https://api.covid19api.com/country/Romania').json()
    active_cases=[]
    for index in range(1, len(data)):
        active_cases.append({"argument": index, "value": data[index]['Recovered'] - data[index-1]['Recovered'] if data[index]['Recovered'] - data[index-1]['Recovered'] > 0  and data[index]['Recovered'] - data[index-1]['Recovered'] < 20000 else 0})
    return JSONResponse(status_code=200, content=active_cases)

@app.get("/getDeathCases")
def getDeathCases():
    data = requests.get('https://api.covid19api.com/country/Romania').json()
    active_cases=[]
    for index in range(1, len(data)):
        active_cases.append({"argument": index, "value": data[index]['Deaths'] - data[index-1]['Deaths'] if data[index]['Deaths'] - data[index-1]['Deaths'] > 0 else 0})
    return JSONResponse(status_code=200, content=active_cases)

@app.get("/getTotalCases")
def getTotalCases():
    data = requests.get('https://api.covid19api.com/country/Romania').json()
    active_cases=[]
    for index in range(1, len(data)):
        active_cases.append({"argument": index, "value": data[index]['Active'] - data[index-1]['Active'] if data[index]['Active'] - data[index-1]['Active'] > 0 and data[index]['Active'] - data[index-1]['Active'] < 10000 else 0})
    return JSONResponse(status_code=200, content=active_cases)
