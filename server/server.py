import json
from logging import debug
from re import L
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
import hashlib
from models.User import User
REQUEST_URL = 'https://api.covid19api.com/live/country/Romania/status/{}/date/{}'
DATA_TO_ADD_URL = 'https://api.covid19api.com/country/Romania'
TYPES=['Active', 'Recovered', 'Deaths']
LAST_DATE = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
link =''
with open('link.txt', 'r') as file:
    link = file.read()
CLIENT = MongoClient(link)
DB = CLIENT.Covid19
app = FastAPI()
origins = ["*"]
CONTENTS={'_id':[]}
cases={}
cases_to_add={}
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_async_data(url, status, last_index):
    data = requests.get(url).json()
    cases.update({status:[]})
    #print(data)
    for index in range(1, len(data)):
        cases[status].append({"argument": last_index+index, "value": data[index][status] - data[index-1][status] if data[index][status] - data[index-1][status] > 0 
                               and data[index][status] - data[index-1][status] < 20000 else 0})
    

def get(date, last_index):
    threads=[]
    for status in TYPES:
        threads.append(Thread(target=get_async_data, args=[REQUEST_URL.format(status, date), status, last_index]))
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join() 


@app.on_event("startup")
async def startup_event():
    data = CLIENT.Covid19.data.find()
    for x in data:
        CONTENTS.update(x)
    date = ''
    with open('last_date.txt', 'r') as file:
        date = file.read()
    date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    modified_date = date + timedelta(days=-1)
    if (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')>= modified_date.strftime('%Y-%m-%d').split('T')[0]:
        try:
            print(CONTENTS[TYPES[0]][-1]['argument'])
            get(modified_date, CONTENTS[TYPES[0]][-1]['argument'])
        except:
            get(modified_date, 0)
        try:
            if(len(CONTENTS[TYPES[0]][0])>1):
                for status in TYPES:
                    for case in cases[status]:
                        result=DB.data.update_one({"_id" : ObjectId("66f41c59563c515949645d85")}, 
                                                { '$push': 
                                                        { 
                                                            status: case, 
                                                        } 
                                                })  
                with open('last_date.txt', 'w') as file:
                    file.write(LAST_DATE)
        except:
            data = requests.get(DATA_TO_ADD_URL).json()
            
            for status in TYPES:
                cases_to_add.update({status:[]})
            for status in TYPES:
                for index in range(1, len(data)-1):
                    cases_to_add[status].append({"argument": index, "value": data[index][status] - data[index-1][status] if data[index][status] - data[index-1][status] > 0 
                                        and data[index][status] - data[index-1][status] < 20000 else 0})
            result=DB.data.insert_one({"_id" : ObjectId("66f41c59563c515949645d85"), 
                                                        TYPES[0]: cases_to_add[TYPES[0]],
                                                        TYPES[1]: cases_to_add[TYPES[1]],
                                                        TYPES[2]: cases_to_add[TYPES[2]]
                                                    })  
            with open('last_date.txt', 'w') as file:
                file.write(LAST_DATE)    

@app.get("/getCases")
def getActiveCases(cases_type: str):   
    if(len(CONTENTS[cases_type])>0):
        return JSONResponse(status_code=200, content=CONTENTS[cases_type])
    return JSONResponse(status_code=200, content=cases_to_add[cases_type])
#to do user routing

@app.post("/register")
def register(user: User):   
    if(len(user.full_name) == 0):
        return JSONResponse(status_code=400, content={'Error': 'Name lenght is invalid'})
    if(len(user.email) == 0):
        return JSONResponse(status_code=400, content={'Error': 'Email lenght is invalid'})
    if(len(user.password) == 0):
        return JSONResponse(status_code=400, content={'Error': 'Password lenght is invalid'})
    DB.users.insert_one({
        'email': hashlib.md5(user.email.encode('utf-8')).hexdigest(),
        'password': hashlib.md5(user.password.encode('utf-8')).hexdigest(),
        'full_name': user.full_name
    })
    return JSONResponse(status_code=200, content={'Success': 'The user has been added'})

@app.get("/login")
def login(email: str, password: str):
    newUser = DB.users.find({
        'email' : hashlib.md5(email.encode('utf-8')).hexdigest(),
        'password' : hashlib.md5(password.encode('utf-8')).hexdigest(),
        })
    loggedUser = ''
    for user in newUser:
       loggedUser=user
    if loggedUser != '':
        return JSONResponse(status_code=200, content={'Success': str(loggedUser)})
    else:
        return JSONResponse(status_code=400, content={'Error': str(loggedUser)})
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
