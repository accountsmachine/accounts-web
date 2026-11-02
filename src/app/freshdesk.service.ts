import { Injectable } from '@angular/core';

export abstract class Config {
  abstract widgetId: number;
  abstract locale: string;
  abstract callback(widget : (...args: unknown[]) => void): void;
}

function getWindow(): Window & Record<string, unknown> {
  return window as unknown as Window & Record<string, unknown>;
}

@Injectable()
export class FreshdeskService {

    // eslint-disable-next-line @angular-eslint/prefer-inject
    constructor(private config: Config) {

	if (this.config == undefined) return;

	if (!this.config.widgetId) {
	    throw new Error(
		'Missing widgetId. Please set in app config via FreshdeskWidgetProvider'
	    );
	}

	const window = getWindow();

	const script = document.createElement('script');

	const id = this.config.widgetId;

	script.type = 'text/javascript';
	script.async = true;
	script.src = `https://euc-widget.freshworks.com/widgets/${id}.js`;

	window['fwSettings'] = {
	    'widget_id': id,
	    'locale': this.config.locale
	};

	/* eslint-disable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-explicit-any, prefer-rest-params */
	window['FreshworksWidget'] || function() {
	    if ("function" != typeof window['FreshworksWidget']) {
		const n : any = function() {
		    n['q'].push(arguments)
		};
		n['q'] = [], window['FreshworksWidget'] = n
	    }
	}();
	/* eslint-enable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-explicit-any, prefer-rest-params */

	const cfg = this.config;

	script.onload = function (_event) {
	    try {
		cfg.callback(window['FreshworksWidget'] as (...args: unknown[]) => void);
	    } catch (error) {
		console.log("error.: ", error)
	    }
	};

	script.onerror = function (event) {
	    console.log("error Onerror.: ", event)
	};

	document.body.append(script);

    }

    get FreshworksWidget() : (...args: unknown[]) => void {
	const window = getWindow();
	return window['FreshworksWidget'] as (...args: unknown[]) => void;
    }

}

