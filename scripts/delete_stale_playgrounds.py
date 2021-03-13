import requests

url = "https://project-calcifer.ml/api/playgrounds"

payload={}
headers = {}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
