type iTypes = "treasure"

export default interface Item<itemType extends iTypes = iTypes> {
  "img": string,
  "name": string,
  "system": {
    "baseItem": null,
    "containerId": null,
    "description": {
      "value": string
    },
    "equippedBulk": {
      "value": string
    },
    "hardness": number,
    "hp": {
      "brokenThreshold": number,
      "max": number,
      "value": number
    },
    "level": {
      "value": number
    },
    "negateBulk": {
      "value": "0"
    },
    "preciousMaterial": {
      "value": ""
    },
    "preciousMaterialGrade": {
      "value": ""
    },
    "price": {
      "value": {
        "gp"?: number
        "sp"?: number
        "cp"?: number
      }
    },
    "quantity": number,
    "rules": [],
    "size": "med"|"lrg"|"sml",
    "source": {
      "value": "PF2E Organ Grinder"
    },
    "stackGroup": null,
    "traits": {
      "rarity": "uncommon"|"common"|"rare"|"unique",
      "value": []
    },
    "usage": {
      "value": ""
    },
    "weight": {
      "value": "-"
    }
  },
  "type": itemType
}
