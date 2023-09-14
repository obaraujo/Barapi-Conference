export function getInfoQuantity(name: string) {
  const units = ["KG", "G", "ML", "L", "LT", "LITROS", "GRAMAS", "UNIDADES"];

  const separateWords = name.split(" ");

  for (let i = 0; i < separateWords.length; i++) {
    const word = separateWords[i].toUpperCase();

    for (let j = 0; j < units.length; j++) {
      const unit = units[j];

      const lengthUnit = unit.length;
      const wordUnit = word.slice(word.length - lengthUnit, word.length);
      const wordQuantity = word.slice(0, word.length - lengthUnit).replace(",", ".");

      if (wordUnit === unit && parseFloat(wordQuantity)) {
        switch (unit) {
          case "G":
            return `${wordQuantity} gramas`;
          case "L":
            return `${wordQuantity} ${parseFloat(wordQuantity) > 1 ? "litros" : "litro"}`;
          case "KG":
            return `${wordQuantity} ${parseFloat(wordQuantity) > 1 ? "quilos" : "quilo"}`;
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

export function formatDate(data: string | Date | number): string {
  if (typeof data === "number" && data.toString().length === 10) {
    data = data * 1000;
  }

  const date = new Date(data);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hour = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateFormatted = `${day}/${month}/${year} às ${hour}:${minutes}`;

  return dateFormatted;
}
