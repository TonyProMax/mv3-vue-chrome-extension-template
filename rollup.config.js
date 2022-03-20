import json from '@rollup/plugin-json';
import vuePlugin from 'rollup-plugin-vue';
import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension';
import { emptyDir } from 'rollup-plugin-empty-dir';
import typescript from 'rollup-plugin-typescript2'; // '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import alias from 'rollup-plugin-alias';
import _dotenv from 'dotenv/config';
import path from "path";

//import injectProcessEnv from 'rollup-plugin-inject-process-env';

export default {
	input: 'src/manifest.json',
	output: {
	  dir: 'dist',
	  format: 'esm',
	  chunkFileNames: 'chunks/[name]-[hash].js',
	},
	
	// watch: { clearScreen: false }, // for dev debug
	plugins: [
		alias({
			entries: {
			  ['@']: path.resolve(__dirname, 'src')
			}}),
	  // chromeExtension() must be first, in order to properly treat manifest.json as the entry point
    chromeExtension({
		extendManifest: {
			"oauth2": {
			    "client_id": process.env.VUE_APP_OAUTH2_CLIENT_ID,
    			"scopes": [
    			  "https://www.googleapis.com/auth/userinfo.email",
    			  "https://www.googleapis.com/auth/userinfo.profile"
    			]
			},
			"key": process.env.VUE_APP_MV3_KEY
		  }
		}
	),
	simpleReloader(), // Adds a Chrome extension reloader during watch mode
	vuePlugin({target: 'browser'}),

    replace({
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_DEVTOOLS__: false,
		"process.env.NODE_ENV": JSON.stringify("production"),
		"process.env.VUE_APP_FIREBASE_APIKEY":  JSON.stringify(process.env.VUE_APP_FIREBASE_APIKEY),
		"process.env.VUE_APP_FIREBASE_AUTHDOMAIN": JSON.stringify(process.env.VUE_APP_FIREBASE_AUTHDOMAIN),
		"process.env.VUE_APP_FIREBASE_PROJECTID": JSON.stringify(process.env.VUE_APP_FIREBASE_PROJECTID),
		"process.env.VUE_APP_FIREBASE_STORAGEBUCKET": JSON.stringify(process.env.VUE_APP_FIREBASE_STORAGEBUCKET),
		"process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID": JSON.stringify(process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID),
		"process.env.VUE_APP_FIREBASE_APPID": JSON.stringify(process.env.VUE_APP_FIREBASE_APPID),
		"process.env.VUE_APP_MEASUREMENTID": JSON.stringify(process.env.VUE_APP_MEASUREMENTID)
		//NODE_ENV: 'production',
		//VITE_FIREBASE_APIKEY:"AIzaSyALiM5CjUlazPQIhqelfCPrXEZrt9X-6ec",
		//VITE_FIREBASE_AUTHDOMAIN:"fumufumu-extension.firebaseapp.com",
		//VITE_FIREBASE_PROJECTID:"fumufumu-extension",
		//VITE_FIREBASE_STORAGEBUCKET:"fumufumu-extension.appspot.com",
		//VITE_FIREBASE_MESSAGINGSENDERID:"1013715547199",
		//VITE_FIREBASE_APPID: "1:1013715547199:web:83d39e91224f2a410c748a",
		//VITE_MEASUREMENTID:"G-K71KP04ZXS"
		//VITE_FIREBASE_APIKEY: process.env.VITE_FIREBASE_APIKEY,
		//VITE_FIREBASE_AUTHDOMAIN: process.env.VITE_FIREBASE_AUTHDOMAIN,
		//VITE_FIREBASE_PROJECTID: process.env.VITE_FIREBASE_PROJECTID,
		//VITE_FIREBASE_STORAGEBUCKET: process.env.VITE_FIREBASE_STORAGEBUCKET,
		//VITE_FIREBASE_MESSAGINGSENDERID: process.env.VITE_FIREBASE_MESSAGINGSENDERID,
		//VITE_FIREBASE_APPID: process.env.VITE_FIREBASE_APPID,
		//VITE_MEASUREMENTID: process.env.VITE_MEASUREMENTID
	  }),
	  typescript(),
	  postcss(),
	  json(),
	  resolve(),
	  commonjs(),
    //injectProcessEnv({ 
    //  NODE_ENV: 'production',
    //  VITE_FIREBASE_APIKEY: process.env.VITE_FIREBASE_APIKEY,
    //  VITE_FIREBASE_AUTHDOMAIN: process.env.VITE_FIREBASE_AUTHDOMAIN,
    //  VITE_FIREBASE_PROJECTID: process.env.VITE_FIREBASE_PROJECTID,
    //  VITE_FIREBASE_STORAGEBUCKET: process.env.VITE_FIREBASE_STORAGEBUCKET,
    //  VITE_FIREBASE_MESSAGINGSENDERID: process.env.VITE_FIREBASE_MESSAGINGSENDERID,
    //  VITE_FIREBASE_APPID: process.env.VITE_FIREBASE_APPID,
    //  VITE_MEASUREMENTID: process.env.VITE_MEASUREMENTID
    //}),
	  // Empties the output dir before a new build
	  emptyDir(),
	],
};

