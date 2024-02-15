// inscription.ts
import { createClient } from "@supabase/supabase-js";
//NOT SURE IF ITS BACKEND' SEEMS MORE LIKE FRONTEND
// const supabaseUrl = import.meta.env.VITE_SUPAURL;
// const supabaseKey = import.meta.env.VITE_SUPAURL;
// VITE_SUPAURL = 'https://bpdbggnwlkpuggqlguqf.supabase.co';
// VITE_SUPAKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZGJnZ253bGtwdWdncWxndXFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjYwMTUzOCwiZXhwIjoyMDE4MTc3NTM4fQ.bbT0aMPW1Zp5BtHgWnhCscgOOSQMsxOjqolHpvHkmK0';

const supabaseUrl = "https://bpdbggnwlkpuggqlguqf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZGJnZ253bGtwdWdncWxndXFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjYwMTUzOCwiZXhwIjoyMDE4MTc3NTM4fQ.bbT0aMPW1Zp5BtHgWnhCscgOOSQMsxOjqolHpvHkmK0";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const sessionActuelle = async function sessionActuelle() {
  const localUser = await supabase.auth.getSession();
  console.log("The users data: ", localUser);
  return localUser;
};

export const userId = async function () {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user data:", error);
    return;
  }
  if (data) {
    const user = data.user;
    console.log("User ID:", user.id);

    // Access user metadata
    let metadata = user.user_metadata;
    console.log("User metadata:", metadata);
  }
};

export const getUserId = async function () {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user data:", error);
    return undefined;
  }
  return data ? data.user.id : undefined;
};

export const getUserData = async function () {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
  if (data) {
    const user = data.user;
    const userData = {
      email: user.email || "",
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      address_city: user.user_metadata?.address_city || "",
      date_of_birth: user.user_metadata?.date_of_birth || "",
      address_number: user.user_metadata?.address_number || "",
      address_street: user.user_metadata?.address_street || "",
      address_province: user.user_metadata?.address_province || "",
      address_country: user.user_metadata?.address_country || "",
      address_postal_code: user.user_metadata?.address_postal_code || "",
    };
    return userData;
  }
};


export const updateUserData = async (updatedData: any) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        address_number: updatedData.address_number,
        address_street: updatedData.address_street,
        address_city: updatedData.address_city,
        address_postal_code: updatedData.address_postal_code,
        address_province: updatedData.address_province,
        address_country: updatedData.address_country,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error updating user data:", error);
    return null;
  }
};


export const fetchBrands = async () => {
  try {
    const { data, error } = await supabase.from("phonedetails").select("marque");

    if (error) {
      console.error("Error fetching brands:", error);
      return [];
    }

    const uniqueBrands = new Set(data?.map((marque) => marque.marque));
    console.log(uniqueBrands);
    //console.log(data);
    return Array.from(uniqueBrands);
  } catch (e) {
    console.error("An error occurred:", e);
    return [];
  }
};

export const fetchModele = async () => {
  try {
    const { data, error } = await supabase.from("phonedetails").select("data_items_product_model");

    if (error) {
      console.error("Error fetching brands:", error);
      return [];
    }

    const uniqueBrands = new Set(data?.map((marque) => marque.data_items_product_model));
    console.log(uniqueBrands);
    //console.log(data);
    return Array.from(uniqueBrands);
  } catch (e) {
    console.error("An error occurred:", e);
    return [];
  }
};

export const fetchModelsByBrand = async (brand: string) => {
  try {
    const { data, error } = await supabase.from("phonedetails").select("data_items_product_model").eq("marque", brand);

    if (error) {
      console.error("Error fetching models by brand:", error);
      return [];
    }

    const uniqueModels = new Set(data?.map((model) => model.data_items_product_model));

    return Array.from(uniqueModels);
  } catch (e) {
    console.error("An error occurred while fetching models:", e);
    return [];
  }
};

export const fetchRamModel = async (brand: string, model: string) => {
  try {
    const { data, error } = await supabase.from("phonedetails").select("data_items_key_aspects_ram").eq("marque", brand).eq("data_items_product_model", model);

    if (error) {
      console.error("Error fetching RAM models by brand and model:", error);
      return [];
    }

    // Split RAM sizes by comma and trim spaces
    const ramModels = data?.map((item) => item.data_items_key_aspects_ram.split(",").map((ram: string) => ram.trim()));

    // Flatten the array to remove nested arrays
    const uniqueRamModels = [...new Set(ramModels.flat())];
    //console.log(ramModels);
    console.log(uniqueRamModels);
    return uniqueRamModels;
  } catch (error) {
    console.error("An error occurred while fetching RAM models:", error);
    return [];
  }
};

export const fetchStorageModel = async (brand: string, model: string) => {
  try {
    const { data, error } = await supabase.from("phonedetails").select("data_items_key_aspects_storage").eq("marque", brand).eq("data_items_product_model", model);

    if (error) {
      console.error("Error fetching STORAGE models by brand and model:", error);
      return [];
    }

    // Split storage options by comma and trim spaces
    const storageModels = data?.map((item) => item.data_items_key_aspects_storage.split(",").map((storage: string) => storage.trim()));

    // Flatten the array to remove nested arrays
    const uniqueStorageModels = [...new Set(storageModels.flat())];
    //console.log(storageModels);
    console.log(uniqueStorageModels);
    return uniqueStorageModels;
  } catch (error) {
    console.error("An error occurred while fetching STORAGE models:", error);
    return [];
  }
};

export const creerAnnonce = async (annonceData: any) => {
  try {
    const geolocationFormat = `POINT(${annonceData.geolocation_annonce.lon} ${annonceData.geolocation_annonce.lat})`;
    const { data, error } = await supabase.from("annonce").insert([
      {
        image: annonceData.image,
        description: annonceData.description,
        prix: annonceData.price,
        etat: annonceData.state,
        marque: annonceData.brand,
        modele: annonceData.model,
        memoire: annonceData.storage,
        ram: annonceData.ram,
        quantite: annonceData.quantity,
        title: annonceData.title,
        geolocation_annonce: geolocationFormat,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      return null;
    }
    console.log("Inserted data");
    return null;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const supprimerAnnonce = async (annonceId: any) => {
  console.log(typeof annonceId + annonceId);
  try {
    const { data, error } = await supabase.from("annonce").delete().eq("id", annonceId);

    if (error) {
      throw error;
    }

    return annonceId;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPreference = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("latitude, longitude, radius, region")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching preference:", error);
    return null;
  }

  if (data) {
    console.assert(data);
    return {
      lat: data.latitude,
      lon: data.longitude,
      radius: data.radius || 50000, // Use default radius if not specified
      region: data.region
    };
  } else {
    console.error("Error fetching preference! S'il vous plaît regarder getUserPreference")
    return null;
  }
};


export const saveUserPreference = async (userId: string, lat: number, lon: number, radius: number,region:string) => {
  const point = `SRID=4326;POINT(${lon} ${lat})`;

  const { data, error } = await supabase.from("user_preferences").upsert(
    [
      // Using upsert method
      {
        user_id: userId,
        location: point,
        radius,
        longitude: lon,
        latitude: lat,
        region,
      },
    ],
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error saving preference:", error);
    return null;
  }
  return data;
};


export const getAnnoncesByUserPreferences = async (userId: any) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_annonces_by_user_preferences",
      { user_id: userId }
    );

    if (error) {
      console.error("Error fetching annonces:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};



export const afficherAnnonceAll = async (userUuid: string) => {
  try {
    const { data, error } = await supabase.from("annonce").select("*").eq("FK_uuid", userUuid);

    console.log(data);
    if (error) {
      console.error("Error fetching annonces:", error);
      return [];
    }
    let annonces = data;
    return annonces;
  } catch (e) {
    console.error("An unexpected error occurred:", e);
    return [];
  }
};

export const afficherAnnonceHomePage = async () => {
  try {
    const { data, error } = await supabase.from("annonce").select("*");
    console.log(data);
    if (error) {
      console.error("Error fetching annonces:", error);
      return [];
    }
    let annonces = data;
    return annonces;
  } catch (e) {
    console.error("An unexpected error occurred:", e);
    return [];
  }
};

export const fetchAnnonceById = async (id: number) => {
  try {
    const { data, error } = await supabase.from("annonce").select("*").eq("id", id);

    if (error) {
      console.error("Error fetching annonce by ID:", error);
      return null;
    }

    return data ? data[0] : null;
  } catch (e) {
    console.error("An unexpected error occurred while fetching annonce by ID:", e);
    return null;
  }
};

//insertion, suppressiion, affichage d'images
export const televerserImage = async (file: any, fileName: string) => {
  const { data, error } = await supabase.storage.from("annoncesImages").upload(`images/${fileName}`, file);
  console.log(data);
  if (error) {
    console.log("erreur téléversment iamge");
    console.log(error);
  } else {
    console.log("succès téléversment iamge");
  }
};

export async function fetchDetailsSpiderChart(model: string, ram: string) {
  try {
    const { data, error } = await supabase.from("phonedetails").select("data_items_display_refresh_rate, data_items_inside_battery_capacity, data_items_display_resolution_h_x_w, data_items_display_diagonal").eq("data_items_product_model", model).single();

    if (error) throw error;

    let metrics = {
      refreshRateMetric: 0,
      batteryCapacityMetric: 0,
      displayResolutionMetric: 0,
      displaySizeMetric: 0,
      ramMetric: calculateRamMetric(ram), // Add RAM metric calculation
    };

    // Handle null or undefined refreshRate
    let refreshRateData = data.data_items_display_refresh_rate || "60"; // Default to "60" if null or undefined

    // Refresh Rate Calculation
    let refreshRates = refreshRateData
      .match(/\d+/g)
      .map(Number)
      .filter((rate: any) => rate <= 165);

    let minRefreshRate = refreshRates.length > 0 ? Math.min(...refreshRates) : 60; // Use 60 if array is empty
    metrics.refreshRateMetric = minRefreshRate <= 60 ? 0.33 : minRefreshRate <= 90 ? 0.66 : minRefreshRate <= 120 ? 0.8 : 1;

    // Battery Capacity Calculation
    let batteryCapacity = parseInt(data.data_items_inside_battery_capacity.match(/\d+/)[0], 10);
    metrics.batteryCapacityMetric = batteryCapacity >= 6000 ? 1 : batteryCapacity / 6000;

    // Display Resolution Calculation
    const maxResolution = 3840 * 2160; // 4K resolution as the maximum
    let [width, height] = data.data_items_display_resolution_h_x_w.split("x").map(Number);
    let resolutionProduct = width * height;
    metrics.displayResolutionMetric = Math.min(resolutionProduct / maxResolution, 1); // Normalize and ensure it does not exceed 1

    // Display Size Calculation
    let displaySize = parseFloat(data.data_items_display_diagonal); // Convert to float
    metrics.displaySizeMetric = Math.min(displaySize / 7, 1); // Normalize with 7 inches as max

    return metrics;
  } catch (error) {
    console.error("Error fetching phone details:", error);
    return {
      refreshRateMetric: 0.33, // Default to 60Hz metric if there's an error
      batteryCapacityMetric: 0,
      displayResolutionMetric: 0,
      displaySizeMetric: 0, // Default value in case of an error
      ramMetric: 0.5, // Example default value for RAM metric, adjust as needed
    };
  }
}

// Function to calculate RAM metric based on the RAM size
function calculateRamMetric(ramSize: string) {
  const maxRamSize = 20;
  const ramValue = parseInt(ramSize.match(/\d+/)[0], 10); // Extract numeric value from RAM size string
  return Math.min(ramValue / maxRamSize, 1); // Ensure the metric does not exceed 1
}