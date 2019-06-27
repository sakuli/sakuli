import {Application} from 'typedoc';
import {join} from "path";

const projectDir = join(__dirname, '..', '..', 'sakuli-legacy');
const srcDir = join(projectDir, 'src')
const app = new Application({

});

app.expandInputFiles([srcDir])