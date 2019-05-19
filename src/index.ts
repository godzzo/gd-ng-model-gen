import { renderFile } from "ejs";

import util = require("util");
import fs = require("fs");
	
import gsjson = require('google-spreadsheet-to-json');

import { SetNames } from "./util";

(async () => {
	try {
		const data = await LoadSpreadsheetData(
			'1A-CnEIWo4YUtYWqw8QZGkfOJzzw0TBXEL1kll3C9nbE',
			"credentials/gd-drive-access-a930341b5052.json"
		);

		console.log(JSON.stringify(data));

		ParseWorkSheets("sample", data);
	} catch (err) {
		console.log(err);
	}
})();

async function LoadSpreadsheetData(spreadsheetId: string, credentials: string) {
	return gsjson({
		spreadsheetId: spreadsheetId,
		credentials: credentials,
		// worksheet: [0, 1, 2]
		allWorksheets: true,
	});
}

async function generate(project: string, meta: any) {
	await generateBackEnd(project, meta);
	await generateFrontEnd(project, meta);
}

async function generateBackEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try{
		const outDir = `out/${project}/backend/${meta.table.name}`;
		await mkdir(outDir, {recursive: true});

		render('templates/backend/controller.ts.ejs', meta, `${outDir}/${meta.table.periodName}.controller.ts`);
		render('templates/backend/entity.ts.ejs', meta, `${outDir}/${meta.table.periodName}.entity.ts`);
		render('templates/backend/module.ts.ejs', meta, `${outDir}/${meta.table.periodName}.module.ts`);
		render('templates/backend/service.ts.ejs', meta, `${outDir}/${meta.table.periodName}.service.ts`);
	}catch(error){
		console.log(error);
	}
}

async function generateFrontEnd(project: string, meta: any) {
	const mkdir = util.promisify(fs.mkdir);

	try{
		const outDir = `out/${project}/frontend/${meta.table.name}`;
		await mkdir(outDir, {recursive: true});

		render('templates/frontend/component.html.ejs', meta, `${outDir}/${meta.table.periodName}.component.html`);
		render('templates/frontend/component.scss.ejs', meta, `${outDir}/${meta.table.periodName}.component.scss`);
		render('templates/frontend/component.ts.ejs', meta, `${outDir}/${meta.table.periodName}.component.ts`);
		render('templates/frontend/model.ts.ejs', meta, `${outDir}/${meta.table.periodName}.model.ts`);
		render('templates/frontend/service.ts.ejs', meta, `${outDir}/${meta.table.periodName}.service.ts`);
	} catch(error) {
		console.log(error);
	}
}

async function render(templatePath: string, model: any, outputPath: string) {
	const writeFile = util.promisify(fs.writeFile);

	try{
		const html = await renderFile(templatePath, model);

 		await writeFile(outputPath, html, "utf8");
	} catch(error) {
		console.log(error);
	}
}

function ParseWorkSheets(project: string, data: Array<any>) {
	const meta = data.shift();

	meta.forEach((table: any) => {
		const columns = data[table.pos - 1];

		SetNames(table);

		columns.forEach(SetNames);

		columns.forEach((column: any) => {

			column.directiveSettings = SetColumnDirective(column);
			column.tsType = column.type;
		});

		table.columns = columns;

		console.log("TABLE: ", JSON.stringify(table, null, 4));

		generate(project, {table});
	});
}

function SetColumnDirective(column: any): string {
	// {name: "first_name", type: "varchar", length: 200}
	// {name: "last_update", type: "timestamp"}

	const cfg: any = {};

	cfg.name = column.name;

	if (column.columnType) {
		cfg.type = column.columnType
	}

	if (column.length) {
		cfg.length = column.length
	}

	return JSON.stringify(cfg);
}

export const NgModelGen = (name: string) => 'Hello '+name;
