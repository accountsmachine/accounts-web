
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

type EnvConfig = any;

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private config : EnvConfig;

    private static instance : ConfigurationService | null = null;

    static getInstance(): ConfigurationService {
	if (!ConfigurationService.instance)
	    throw new Error("ConfigurationService not initialised");
	return ConfigurationService.instance;
    }

    features : Set<string> = new Set<string>();

    constructor(private readonly http: HttpClient) {
	ConfigurationService.instance = this;
    }
    
    async loadConfig(configPath: string): Promise<void> {
	this.config = await lastValueFrom(
	    this.http.get<EnvConfig>(configPath)
	);
	this.features = new Set<string>(this.config.features);
    }

    getConfig(): EnvConfig {
	return this.config;
    }

    getFirebase() : any {
	return this.getConfig()["firebase"];
    }

    hasFeature(f : string) : boolean {
	return this.features.has(f);
    }

    noFeatures() : boolean {
	return this.features.size == 0;
    }

}

