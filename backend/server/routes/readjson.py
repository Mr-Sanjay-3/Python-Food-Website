import json
with open('/home/nova/Projects/Learning/PythonProject/backend/server/routes/data/DummyData.json','r') as readj:
    readed = json.load(readj)

    print(readed[0]['img'])