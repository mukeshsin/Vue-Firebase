import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadPostPhoto = async (user, photo) => {
  const storage = getStorage();
  const storageRef = ref(storage, `posts/${user.uid}/${photo.name}`);
  const snapshot = await uploadBytes(storageRef, photo);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
