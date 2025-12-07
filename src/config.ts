import fs from "node:fs";
import os from "node:os";
import path from "node:path";


export type Config = {
  	dbUrl: string;
  	currentUserName: string;
};

type PartialRawConfig = {
	db_url?: unknown;
	current_user_name?: unknown;
};


export function setUser(userName: string): void {
	const config: Config = readConfig();
	config.currentUserName = userName;
	writeConfig(config);
}

function validateConfig(rawConfig: PartialRawConfig): Config {
	if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
		throw new Error("config missing: db_url");
	}
	if (
		!rawConfig.current_user_name ||
		typeof rawConfig.current_user_name !== "string"
	) {
		throw new Error("config missing: current_user_name");
	}

	const config: Config = {
		dbUrl: rawConfig.db_url,
		currentUserName: rawConfig.current_user_name,
	};

	return config;
}

export function readConfig(): Config {
	const fullPath: string = getConfigFilePath();

	const data: string = fs.readFileSync(fullPath, "utf-8");
	const rawConfig: PartialRawConfig = JSON.parse(data) as PartialRawConfig;

	return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    const configFileName: string = ".gatorconfig.json";
	const homeDir: string = os.homedir();
	return path.join(homeDir, configFileName);
}

function writeConfig(config: Config): void {
	const fullPath: string = getConfigFilePath();

	const rawConfig: Config = {
		dbUrl: config.dbUrl,
		currentUserName: config.currentUserName,
	};

	const data: string = JSON.stringify(rawConfig, null, 2);
	fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
}