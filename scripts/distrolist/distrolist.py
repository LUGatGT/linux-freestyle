from bs4 import BeautifulSoup

f = open("index.html")
html_doc = f.read()
soup = BeautifulSoup(html_doc, 'html.parser')

forms = soup.find_all('form')
distro_form = forms[1]

distro_options = distro_form.find_all('option')

distro_list = []
for option in distro_options:
    distro = option.get('value')
    #distro_display_name = (option.get_text())
    #distro_tuple = (distro, distro_display_name)
    distro_list.append(distro)

distro_list = distro_list[1:] # remove the select distro option
for distro in distro_list:
    print(distro)
