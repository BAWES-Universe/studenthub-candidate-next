import { RootState, useAppSelector } from "@/store/store";
//import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Make date readable by Safari
 * @param date
 */
export function toDate(date: string) {
    if (date) {
        return new Date(date.replace(/-/g, '/'));
    }
}

/**
 * Return content based on language selected
 * @param enContent
 * @param arContent
 */
export function langContent(enContent: string, arContent: string) {

    const { language } = useAppSelector((state: RootState) => state.app);

    if (language == 'ar' && arContent) {
        return arContent;
    }

    return enContent? enContent: arContent;
}

export function isString(x: any) {
    return Object.prototype.toString.call(x) === "[object String]"
}

/**
 * json to string error message
 * @param message
 */
export function errorMessage(message: string | any): string {

    if (isString(message))
    {
        return message + '';
    }

    const a: string[] = [];

    for (const i in message) {

        if (!Array.isArray(message[i])) {
            a.push(message[i]);
            continue;
        }

        for (const j of message[i]) {
            a.push(j);
        }
    }

    return a.join('<br />');
}


export async function convertBlobToBase64(blob: Blob) { // blob data
    return await blobToBase64(blob);
  }

export function blobToBase64(blob:Blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

    if (blob instanceof Blob) {
      const realFileReader = (reader as any)._realReader;
      if (realFileReader) {
        reader = realFileReader;
      }
    }

    reader.readAsDataURL(blob);
    reader.onload = async (data) => {
      resolve(reader.result);
    }
    reader.onerror = error => {
      console.log('error',error);
      reject(error);
    }
  });

  /**
   * @param name
   * @private
   */
export function getMimeType(name: string) {
    if (name.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (name.indexOf('png') >= 0) {
      return 'image/png';
    } else if (name.indexOf('mp4') >= 0) {
      return 'video/mp4';
    }
  }
/*
export async function fileWrite(blob: Blob, filename: string) {
    try {
      const saveFile = await Filesystem.writeFile({
        path: filename,
        data: blob,
        directory: Directory.Documents,
      })
      const path = saveFile.uri;
      const mimeType = getMimeType(filename);
      
      fileOpener.open(path, mimeType)
        .then(() => console.log('file is opened'))
        .catch(err => console.error(err));

    } catch(e) {
      console.error('Unable to write file', e);
    }
}
*/