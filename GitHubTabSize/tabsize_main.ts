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
import { getAllOptions, getTabSize, StorageName, getEnabled } from "./messages";
import { PageChangeAlert } from "./page_change_message";

console.log("Loaded");

getAllOptions((items) => {
	let tabSize = String(getTabSize(items));
	let enabled = getEnabled(items);
	const attemptChange = () => {
		console.log("In attempt change");
		if (!enabled) {
			return;
		}
		const tabbedElements = document.getElementsByClassName("tab-size");
		const attribName = "data-tab-size";
		for (let i = 0; i < tabbedElements.length; ++i) {
			const tabbed = tabbedElements[i];
			if (tabbed.hasAttribute(attribName)) {
				tabbed.setAttribute(attribName, tabSize);
			}
		}
	};
	chrome.runtime.onMessage.addListener((request) => {
		if (request) {
			if (request === PageChangeAlert.PageChange) {
				console.log("Page change");
				attemptChange();
			}
			else {
				{
					const tabSizeNew = request[StorageName.TabSize];
					if (typeof (tabSizeNew) === "string") {
						console.log("New tab size: " + tabSizeNew);
						tabSize = tabSizeNew;
						attemptChange();
					}
				}
				{
					const enabledNew = request[StorageName.Enabled];
					if (enabledNew !== undefined) {
						console.log("New enabled value: " + enabledNew);
						enabled = Boolean(enabledNew);
						attemptChange();
					}
				}
			}
		}
	});
});