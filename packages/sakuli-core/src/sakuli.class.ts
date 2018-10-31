import { ProjectLoader } from "./loader/loader.interface";

export class Sakuli {

    constructor(
        readonly loader: ProjectLoader[]
    ) {}

    async run(path: string) {
        const projects = await Promise.all(
            this.loader.map(loader => loader.load(path))
        );
        const project = projects.find(p => p != null);
        
    }

}