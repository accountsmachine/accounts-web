
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

type EnvConfig = any;

@Injectable({
    providedIn: 'root'
})
export class ConfigurationLoaderService {

    private config : EnvConfig;

    private static instance : ConfigurationLoaderService | null = null;

    static getInstance(): ConfigurationLoaderService {
	if (!ConfigurationLoaderService.instance)
	    throw new Error("ConfigurationLoaderService not initialised");
	return ConfigurationLoaderService.instance;
    }

    constructor(private readonly http: HttpClient) {
	ConfigurationLoaderService.instance = this;
    }
    
    async loadConfig(configPath: string): Promise<void> {
	this.config = await lastValueFrom(
	    this.http.get<EnvConfig>(configPath)
	);
	console.log("LOADING....");
    }

    getConfig(): EnvConfig {
	return this.config;
    }

    getFirebase() : any {
	return this.getConfig()["firebase"];
    }

}

