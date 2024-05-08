import os
import json
import csv



def getWordUrl(dataLs):
  wordLs = []
  for word in dataLs:
    wordLs.append(word['word'])
  
  urlLs = []
  for word in wordLs:
    if word != '----------------':
      url = f'https://fanyi.baidu.com/mtpe-individual/multimodal?query={word}&lang=en2zh'
    else:
      url = '#'
    urlLs.append(url)

  for item in dataLs:
    item['url'] = urlLs[wordLs.index(item['word'])]
  # print(dataLs)
  return dataLs
def transformData(csvFile, jsonFile):
  with open(csvFile, 'r', encoding='utf-8') as infile:
    dataList = list(csv.DictReader(infile))
    print(dataList[:18])
    dataList = getWordUrl(dataLs=dataList)
  
  with open(jsonFile, 'w') as outfile:
    json.dump(dataList, outfile, ensure_ascii=False, indent=1)

dataPath = './data' 
transformData(os.path.join(dataPath, 'data.csv'), os.path.join(dataPath, 'data.json'))
