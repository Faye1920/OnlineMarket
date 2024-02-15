import tech_specs_api_key from "./utility.js";
import getPhoneFromApi from "./convertirEtStocker.js";

function fetchPage(page, brand) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: tech_specs_api_key,
      "content-type": "application/json",
    },
    body: JSON.stringify({ category: ["Smartphones"], from: "2020-01-30", brand: [brand] }),
  };

  fetch(`https://api.techspecs.io/v4/all/products/?page=${page}`, options)
    .then((response) => response.json())
    .then((response) => {
      if (response.data) {
        response.data.items.forEach((item) => {
          setTimeout(() => {
            getPhoneFromApi(item.product.id);
          }, Math.min(2000, Math.random() * 4000));
        });

        if (response.data.page < response.data.total_pages - 1) {
          console.log("ecriture " + brand + " page " + page);
          fetchPage(page + 1, brand);
        }
      } else {
        console.error("response.data is undefined", response);
      }
    })
    .catch((err) => console.error(err));
}

const brands = ["Samsung", "Huawei", "Oppo", "ZTE", "LG", "Xiaomi", "Motorola", "Nokia", "HTC", "Lenovo", "Alcatel", "Sony", "ASUS", "TCL", "Acer", "OnePlus", "Nothing", "Doogee", "Sony Ericsson", "Ericsson", "Apple", "Google", "Honor"];

function main() {
  brands.forEach((brand) => fetchPage(0, brand));
}

export default main;
