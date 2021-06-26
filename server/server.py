from logging import debug
from typing import Optional
import requests
from datetime import datetime
import uvicorn
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from requests.api import request

app = FastAPI()
origins = ["*"]
types=['Active', 'Recovered', 'Deaths']
cases={}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    data = requests.get('https://api.covid19api.com/country/Romania').json()
    for type in types:
        cases.update({type:[]})
        for index in range(1, len(data)):
            cases[type].append({"argument": index, "value": data[index][type] - data[index-1][type] if data[index][type] - data[index-1][type] > 0 
                                and data[index][type] - data[index-1][type] < 20000 else 0})
    

@app.get("/getCases")
def getActiveCases(cases_type: str):
    return JSONResponse(status_code=200, content=cases[cases_type])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
