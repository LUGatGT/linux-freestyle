from bs4 import BeautifulSoup
import sys

f = open(sys.argv[1])
html_doc = f.read()
soup = BeautifulSoup(html_doc, 'html.parser')
tables = soup.find_all('table')
image_url = 'distrowatch.com/' + tables[5].find_all('tr')[2].find('td').find('hr').find('img').get('src')
print(image_url)
