import re
import requests
from bs4 import BeautifulSoup
import json


def read_drug_names(filename):
    names = []
    fd = open(filename, "r")
    for line in fd:
        line = line.strip()
        drug_id, name = line.split()
        names.append((drug_id, name))

    fd.close()
    return names


def next_nonempty_sibling(element):
    while (element.next_sibling.text.strip() == ""):
        element = element.next_sibling
    return element.next_sibling


def get_page(drug_name, url=None):

    BASE_URL = "https://www.drugs.com"
    if url:
        page = requests.get(BASE_URL + url)
        if page.status_code == 200:
            return page

    urls = [f"/{drug_name}.html",
            f"/mtm/{drug_name}.html"]
    for url in urls:
        page = requests.get(BASE_URL + url)
        if page.status_code == 200:
            return page

    print('404 shitness')


# skipped becuase layout was a bit different
# TODO: write special cases for bad layout?
SKIPPED = {"potassium", "magnesium"}


def get_drug_info(drug_name, url=None):

    if (drug_name in SKIPPED):
        return
    res = {}
    page = get_page(drug_name, url=url)
    if not page:
        print("bad", drug_name)
        return
    soup = BeautifulSoup(page.content, "html.parser")

    # subtitle block contains brand name, generic name
    subtitle = soup.find("p", class_="drug-subtitle")

    # generic name
    generic_name_heading = subtitle.find("b", string="Generic name:")
    generic_name_element = next_nonempty_sibling(generic_name_heading)
    generic_name, _, _ = generic_name_element.text.partition("(")
    if (drug_name.lower() not in generic_name.lower()):
        # given name is not the generic name
        # only get data for generic name
        if (generic_name_element.name == "a"):
            url = generic_name_element["href"]
        else:
            url = None
        return get_drug_info(generic_name, url=url)
    res["generic_name"] = generic_name.strip()

    # brand name
    brand_name_heading = subtitle.find(
        "b", string=["Brand Names:", "Brand name:"])
    brand_name_element = next_nonempty_sibling(brand_name_heading)
    if (brand_name_element.name == "i"):
        res["brand_names"] = [brand.strip()
                              for brand in brand_name_element.text.split(",")]

    # description
    res["description"] = []
    description = next_nonempty_sibling(soup.find(id="uses"))
    while (description.name == "p"):
        res["description"].append(description.text)
        description = next_nonempty_sibling(description)

    return res


names = read_drug_names("drug_names.tsv")
good = total = 0
usable_drugs = {}
for drug_id, name in names:
    try:
        res = get_drug_info(name)
        if res:
            good += 1
            res["db_name"] = name
            usable_drugs[drug_id] = res
    except Exception:
        pass
    total += 1

with open("drug_data_web", "w") as fd:
    json.dump(usable_drugs, fd)
