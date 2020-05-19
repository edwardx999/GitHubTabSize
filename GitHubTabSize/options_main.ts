/*
Copyright(C) 2020 Edward Xie

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
import { getAllOptions, StorageName, DefaultValues, storeOptions, getTabSize, getEnabled, Storable } from "./messages"

const slider = <HTMLInputElement>document.getElementById("tabsizeslider");
const inputText = <HTMLInputElement>document.getElementById("tabsizetext");
const enabledCheckBox = <HTMLInputElement>document.getElementById("enabledcheckbox");
const sliderlist = document.getElementById("listdiv");

const min = Number(slider.min);
const max = Number(slider.max);

{
	const listid = "sliderlist";
	let listText = "<datalist id=\"" + listid + "\">";
	for (let x = min; x <= max; ++x) {
		listText += "<option>" + x + "</option>";
	}
	listText += "</datalist>";
	sliderlist.innerHTML = listText;
}

let previousValue: string;

getAllOptions((items) => {
	const tabSize = getTabSize(items);
	const enabled = getEnabled(items);
	slider.disabled = false;
	inputText.disabled = false;
	enabledCheckBox.disabled = false;
	enabledCheckBox.checked = enabled;

	const tabSizeString = String(tabSize);
	previousValue = tabSizeString;
	inputText.value = tabSizeString;
	slider.value = tabSizeString;
	slider.addEventListener("input", () => {
		inputText.value = slider.value;
	});
	slider.addEventListener("change", () => {
		notifyTabSizeChange(slider.value);
	});
	const inputTextListener = () => {
		let num = Number(inputText.value);
		if (num >= 0 && Number.isInteger(num)) {
			if (num > max) {
				num = max;
			}
			const value = String(num);
			notifyTabSizeChange(value);
			slider.value = value;
		}
		else {
			inputText.value = previousValue;
		}
	};
	inputText.addEventListener("focusout", inputTextListener)
	inputText.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			inputTextListener();
		}
	});
	enabledCheckBox.addEventListener("change", () => {
		const value = enabledCheckBox.checked;
		notifyChange(StorageName.Enabled, value);
	})
});

function notifyChange(name: StorageName, value: Storable) {
	chrome.tabs.query({}, (tabs) => {
		for (const tab of tabs) {
			chrome.tabs.sendMessage(tab.id, { [name]: value });
		}
	});
	storeOptions({ [name]: value });
}

function notifyTabSizeChange(value: string) {
	previousValue = value;
	notifyChange(StorageName.TabSize, value);
}