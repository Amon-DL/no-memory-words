import os
import json
import csv



def getWordUrl(dataLs):
  wordLs = []
  for word in dataLs:
    wordLs.append(word['word'])
  
  # 分页列表
  nextPageOrNotLs = []
  urlLs = []
  for word in wordLs:
    if word != '---':
      url = f'https://fanyi.baidu.com/mtpe-individual/multimodal?query={word}&lang=en2zh'
      # 增加分页标识
      nextPage = False

    else:
      url = '#'
      nextPage = True
    urlLs.append(url)
    nextPageOrNotLs.append(nextPage)

  for item in dataLs:
    item['url'] = urlLs[wordLs.index(item['word'])]
    # 增加分页标识
    item['nextPage'] = nextPageOrNotLs[wordLs.index(item['word'])]
  # print(dataLs)
  return dataLs
def transformData(csvFile, jsonFile):
  with open(csvFile, 'r', encoding='utf-8') as infile:
    dataList = list(csv.DictReader(infile))
    dataList = getWordUrl(dataLs=dataList)
    print(dataList[:18])
  
  with open(jsonFile, 'w', encoding='utf-8') as outfile:
    json.dump(dataList, outfile, ensure_ascii=False, indent=1)

dataPath = './data' 
transformData(os.path.join(dataPath, 'data.csv'), os.path.join(dataPath, 'data.json'))
# print()
