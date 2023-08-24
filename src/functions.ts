export function getInfoQuantity(name: string) {
  const units = ["KG", "G", "ML", "L", "LT", "LITROS", "GRAMAS", "UNIDADES"];

  const separateWords = name.split(" ");

  for (let i = 0; i < separateWords.length; i++) {
    const word = separateWords[i].toUpperCase();

    for (let j = 0; j < units.length; j++) {
      const unit = units[j];

      const lengthUnit = unit.length;
      const wordUnit = word.slice(word.length - lengthUnit, word.length);
      const wordQuantity = word
        .slice(0, word.length - lengthUnit)
        .replace(",", ".");

      if (wordUnit === unit && parseFloat(wordQuantity)) {
        switch (unit) {
          case "G":
            return `${wordQuantity} gramas`;
          case "L":
            return `${wordQuantity} ${
              parseFloat(wordQuantity) > 1 ? "litros" : "litro"
            }`;
          case "KG":
            return `${wordQuantity} ${
              parseFloat(wordQuantity) > 1 ? "quilos" : "quilo"
            }`;
          default:
            return word;
        }
      }
    }

    if (word === "UNIDADES" || word === "UNIDADE") {
      return `${separateWords[i - 1]} ${separateWords[i].toLowerCase()}`;
    }
  }
}
