import json
import pandas as pd

with open("drug_data_web", "r") as fd:
    drug_data = json.load(fd)

indications_df = pd.read_csv("meddra_all_indications.tsv",
                             sep="\t", usecols=[0, 3],
                             names=["id", "indication"])
freq_df = pd.read_csv("meddra_freq.tsv",
                      sep="\t", usecols=[0, 6, 9],
                      names=["id", "freq", "name"])

drug_names_df = pd.read_csv("drug_names.tsv",
                            sep="\t",
                            names=["id", "names"])

# filter out entries with duplicate (drug, symptom), keeping the most frequent
# get n most frequent symptoms for each drug
freq_df = (freq_df
           .sort_values(["freq"], ascending=False)
           .drop_duplicates(subset=["name", "id"], keep="first")
           .groupby(["id"]).head(7)
           )
# filter out zero frequency
freq_df = freq_df[freq_df["freq"] != 0]

indications_df = indications_df.drop_duplicates()

# add indications to drug data
for drug_id, df in indications_df.groupby("id"):
    if drug_id not in drug_data:
        continue
    drug_data[drug_id]["indications"] = list(df["indication"].unique())


# add side effects to drug data
for drug_id, df in freq_df.groupby("id"):
    if drug_id not in drug_data:
        continue
    side_effects = list(map(tuple, list(
        df[["name", "freq"]].to_records(index=False))))

    drug_data[drug_id]["side_effects"] = []
    for k, v in side_effects:
        drug_data[drug_id]["side_effects"].append({"name": k, "freq": v})


def generate_keywords(brand_names, generic_name):
    # for search
    names = brand_names + [generic_name]
    res = set()
    for name in names:
        name = name.lower()
        for i in range(len(name)):
            res.add(name[0: i+1])

    return sorted(list(res))


for drug_id, drug in drug_data.items():
    # filter out brand names that contain ...show all N brand names
    if "brand_names" not in drug:
        drug["brand_names"] = []

    brand_names = drug["brand_names"]

    for i, brand in enumerate(brand_names):
        if "brand names" in brand:
            _, _, name = brand.partition("brand names")
            brand_names[i] = name

    drug["keywords"] = generate_keywords(
        drug["brand_names"], drug["generic_name"])

    if "side_effects" not in drug:
        drug["side_effects"] = []

    if "indications" not in drug:
        drug["indications"] = []

with open("drug_data_web_sider.json", "w") as fd:
    json.dump({"drugs": drug_data}, fd)
