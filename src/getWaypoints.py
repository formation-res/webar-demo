import requests
import sys, json

token = None
groupId = None

def search(groupId: str, token:str, item: str) -> list:
    url = 'https://api.tryformation.com/search'
    headers = {'accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    payload =   {
                "groupIds": [groupId],
                "radiusMeters" : 50,
                "tags" : ["Keyword:waypoint"]
                }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data['hits']
    else:
        print(f"Request failed with status code {response.status_code}")
        print(response.text)


def connect(item: str):
    url = 'https://api.tryformation.com/token/loginToWorkspace'
    headers = {'accept': 'application/json', 'Content-Type': 'application/json'}
    payload = {
        "workspace": "demo",
        "email": "athena@tryformation.com",
        "password": "Athrap@11"
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        token = data['apiAccessToken']['token']
        groupId = data['groups'][0]['groupId']
        groupName = data['groups'][0]['groupName']
        userId = data['groups'][0]['userId']
        return search(groupId, token, item)
    else:
        print(f"Request failed with status code {response.status_code}")


def CreateJson(obj: list, dest: str):
    outFile = "./src/data/" + dest  #dump the info into an out file
    sys.stdout = open(outFile, 'w')

    json_obj = json.dumps(obj)
    
    print("export var json_str_wp = '{}' ".format(json_obj) )


if __name__ == "__main__":

    results = connect("waypoint")
    CreateJson(results, "waypoint_dump.js")

    #results = connect("Toilet")

    # print(f"Number of results: {len(results)}")
    # for i in range(len(results)):
    #     print(results[i]['hit'])
