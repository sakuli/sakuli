import {EOL, tmpdir} from 'os'
import {join} from "path";
import {TestStepContext} from "@sakuli/core";
import {promises as fs} from "fs";
import {TestStepContextCacheMarshaller} from "./test-step-context-cache-marshaller.class";

export class TestStepCache {

    constructor(
        private readonly cacheLocation: string = join(process.cwd()),
        private readonly marshaller: TestStepContextCacheMarshaller = new TestStepContextCacheMarshaller()
    ) {
    }

    get cacheFile() {
        return join(this.cacheLocation, '.steps.cache');
    }

    async write(steps: TestStepContext[]) {
        const content = steps.map(step => this.marshaller.marshall(step)).join(EOL);
        await fs.writeFile(
            this.cacheFile,
            content,
            {flag: 'w'}
        )
    }

    async exists(): Promise<boolean> {
        try {
            await fs.access(this.cacheFile);
            return true;
        } catch (e) {
            return false
        }
    }

    async read(): Promise<Partial<TestStepContext>[]> {
        if (await this.exists()) {
            const fileContent = await fs.readFile(this.cacheFile);
            const trimmedFileContent = fileContent.toString().trim();
            if (trimmedFileContent) {
                return trimmedFileContent.split(EOL)
                    .map(line => this.marshaller.unMarshall(line));
            } else {
                return [];
            }
        } else {
            return []
        }
    }
}
