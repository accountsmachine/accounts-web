import { Injectable } from '@angular/core';

export abstract class Config {
  abstract widgetId: number;
  abstract locale: string;
  abstract callback(widget : any): any;
}

function getWindow(): any {
  return window;
}

@Injectable()
export class FreshdeskService {

    constructor(private config? : Config) {

	if (this.config == undefined) return;

	if (!this.config.widgetId) {
	    throw new Error(
		'Missing widgetId. Please set in app config via FreshdeskWidgetProvider'
	    );
	}

	const window = getWindow();

	const script = document.createElement('script');

	let id = this.config.widgetId;

	script.type = 'text/javascript';
	script.async = true;
	script.src = `https://euc-widget.freshworks.com/widgets/${id}.js`;

	window.fwSettings = {
	    'widget_id': id,
	    'locale': this.config.locale
	};

	window.FreshworksWidget || function() {
	    if ("function" != typeof window.FreshworksWidget) {
		let n : any = function() {
		    n['q'].push(arguments)
		};
		n['q'] = [], window.FreshworksWidget = n
	    }
	}();

	let cfg = this.config;

	script.onload = function (event) {
	    try {
		cfg.callback(window.FreshworksWidget);
	    } catch (error) {
		console.log("error.: ", error)
	    }
	};

	script.onerror = function (event) {
	    console.log("error Onerror.: ", event)
	};

	document.body.append(script);

    }

    get FreshworksWidget() {
	const window = getWindow();
	return window.FreshworksWidget;
    }

}

