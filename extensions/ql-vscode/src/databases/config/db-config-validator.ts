import { readJsonSync } from "fs-extra";
import { resolve } from "path";
import Ajv from "ajv";
import { DbConfig } from "./db-config";

export class DbConfigValidator {
  private readonly schema: any;

  constructor(extensionPath: string) {
    const schemaPath = resolve(
      extensionPath,
      "workspace-databases-schema.json",
    );
    this.schema = readJsonSync(schemaPath);
  }

  public validate(dbConfig: DbConfig): string[] {
    const ajv = new Ajv({ allErrors: true });
    ajv.validate(this.schema, dbConfig);

    if (ajv.errors) {
      return ajv.errors.map(
        (error) => `${error.instancePath} ${error.message}`,
      );
    }

    return [];
  }
}
