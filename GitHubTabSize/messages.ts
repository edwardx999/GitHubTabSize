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
export type Storable = number | boolean | string | Date | Storable[];

export const enum StorageName {
	TabSize = "githubtabsize",
	Enabled = "githubtabsizeenabled"
}

export const DefaultValues = {
	[StorageName.TabSize]: 4,
	[StorageName.Enabled]: true
};

export type StorageUnit = {
	[key in StorageName]?: Storable;
};

export function storeOptions(storage: StorageUnit) {
	chrome.storage.local.set(storage);
}

export type GetStorageCallback = (items: undefined | StorageUnit) => void;

export function getOptions(names: StorageName | StorageName[], callback?: GetStorageCallback): void {
	chrome.storage.local.get(names, callback);
}

export function getAllOptions(callback?: GetStorageCallback): void {
	return getOptions([StorageName.TabSize, StorageName.Enabled], callback);
}

export function getTabSize(items: undefined | StorageUnit): number {
	if (items) {
		let tabSize = items[StorageName.TabSize];
		if (tabSize === undefined) {
			return DefaultValues[StorageName.TabSize];
		}
		else {
			tabSize = Number(tabSize);
			if (isNaN(tabSize)) {
				return DefaultValues[StorageName.TabSize];
			}
			return tabSize;
		}
	}
	else {
		return DefaultValues[StorageName.TabSize];
	};
}

export function getEnabled(items: undefined | StorageUnit): boolean {
	if (items) {
		let enabled = items[StorageName.Enabled];
		if (enabled === undefined) {
			return DefaultValues[StorageName.Enabled];
		}
		else {
			return Boolean(enabled);
		}
	}
	else {
		return DefaultValues[StorageName.Enabled];
	};
}