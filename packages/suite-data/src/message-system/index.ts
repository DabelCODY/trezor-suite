import * as json2ts from 'json-schema-to-typescript';
import * as fs from 'fs';
import { resolve, join } from 'path';

/*
 * Bump version in case the new version of message system is not backward compatible.
 * Have to be in sync with constant in messageSystemConstants.ts file in 'suite' package.
 */
const MESSAGE_SYSTEM_VERSION = 1;

const projectRoot = resolve(__dirname, '../..');
const packagesRoot = resolve(projectRoot, '../');

// TODO: To be changed when CI signing is ready
const copyConfig = () => {
    const filesPath = join(projectRoot, 'files', 'message-system');

    fs.mkdir(filesPath, { recursive: true }, () => {
        const configPath = join(__dirname, 'config');

        fs.copyFileSync(
            join(configPath, `config.v${MESSAGE_SYSTEM_VERSION}.json`),
            join(filesPath, 'config.json'),
        );
    });
};

const transformSchemaToTypeScriptTypes = () => {
    const options = {
        style: { singleQuote: true, tabWidth: 4 },
        ignoreMinAndMaxItems: true,
        bannerComment: `/**
            * DO NOT MODIFY BY HAND! This file was automatically generated.
            * Instead, modify the original JSONSchema file in suite-data package, and rebuild the project.
            */`,
    };

    const schemaPath = join(__dirname, 'schema');
    const suiteTypesPath = join(packagesRoot, 'suite', 'src', 'types', 'suite');

    json2ts
        .compileFromFile(join(schemaPath, `config.schema.v${MESSAGE_SYSTEM_VERSION}.json`), options)
        .then(ts => {
            fs.writeFileSync(join(suiteTypesPath, 'messageSystem.ts'), ts);
        });
};

copyConfig();
transformSchemaToTypeScriptTypes();
