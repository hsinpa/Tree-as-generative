import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from './UtilityFunc';

class WebglResource {
    textureCache : Dictionary<string, HTMLImageElement>;

    constructor() {
        this.textureCache = new Dictionary();
    }

    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.setValue(path, texture);

        return texture;         
    }

    
    ForceGetImage(path : string) : HTMLImageElement | null {
        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        return null;         
    }
}

export default WebglResource;