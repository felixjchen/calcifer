# 0 * * * * python3 ~/project-calcifer/scripts/delete_stale_playgrounds.py

import requests

url = "https://project-calcifer.ml/api/playgrounds"

payload={}
headers = {}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
