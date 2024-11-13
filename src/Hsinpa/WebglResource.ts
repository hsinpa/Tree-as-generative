import {GetImagePromise} from './UtilityFunc';

class WebglResource {
    textureCache : Map<string, HTMLImageElement>;

    constructor() {
        this.textureCache = new Map();
    }

    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.has(path)) {
            return this.textureCache.get(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.set(path, texture);

        return texture;         
    }

    
    ForceGetImage(path : string) : HTMLImageElement | null {
        if (this.textureCache.has(path)) {
            return this.textureCache.get(path);
        }

        return null;         
    }
}

export default WebglResource;