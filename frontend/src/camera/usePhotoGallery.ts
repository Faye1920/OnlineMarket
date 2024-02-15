import { ref, onMounted, watch } from "vue";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { isPlatform } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { supabase, televerserImage } from "../../src/bdd/client/system/supabase";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export const usePhotoGallery = () => {
  const PHOTO_STORAGE = "photos";
  const photos = ref<UserPhoto[]>([]);

  const convertBlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });

  const cachePhotos = () => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

    if (!isPlatform("hybrid")) {
      for (const photo of photosInPreferences) {
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    photos.value = photosInPreferences;
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;
    if (isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const deletePhoto = async (photo: UserPhoto) => {
    photos.value = photos.value.filter((p) => p.filepath !== photo.filepath);

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 75,
    });

    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = await savePicture(photo, fileName);

    photos.value = [savedFileImage, ...photos.value];
  };

  const uploadPhoto = async () => {
    const photoUrls = [];
    try {
      for (const photo of photos.value) {
        let blob;
        if (isPlatform("hybrid")) {
          const file = await fetch(photo.filepath);
          blob = await file.blob();
        } else {
          if (photo.webviewPath) {
            const response = await fetch(photo.webviewPath);
            blob = await response.blob();
          } else {
            throw new Error("webviewPath is undefined");
          }
        }
        const fileName = photo.filepath.split("/").pop();
        await televerserImage(blob, fileName);
        photoUrls.push(`https://bpdbggnwlkpuggqlguqf.supabase.co/storage/v1/object/public/annoncesImages/images/${fileName}`);
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
    return photoUrls;
  };

  onMounted(loadSaved);
  watch(photos, cachePhotos);

  return {
    photos,
    deletePhoto,
    takePhoto,
    uploadPhoto,
  };
};
