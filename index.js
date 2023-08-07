const fs = require("fs");

const definitions = require("./app.json").definitions;

const data = {};

const getTranslation = (json) => {
   if (json.json) getTranslation(json.json);

   json.translations?.forEach((translation) => {
      if (translation.text)
         translation.text.match(/<[^>]*>([^<]+)<\/[^>]*>/g).forEach((html) => {
            const word = html.replace(/<|>/g, "-----").split("-----")[2];

            data[`${translation.label}.${word}`] = word;
         });
      else if (translation.label && translation.label?.split(".").length === 1)
         data[translation.label] = translation.label;

      if (translation.description)
         data[translation.description] = translation.description;
   });
};

definitions.forEach((definition) => {
   getTranslation(definition);
});

fs.writeFileSync("app-output.json", JSON.stringify(data));
