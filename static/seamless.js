"use strict";

const devices = ["blueline", "crosshatch", "taimen", "walleye"];
const channels = ["stable", "beta"];

function createLink(href, text) {
    const link = document.createElement("a");
    link.appendChild(document.createTextNode(text));
    link.href = href;
    return link;
}

function deviceModel(device) {
    if (device === "blueline") {
        return "Pixel 3";
    }
    if (device === "crosshatch") {
        return "Pixel 3 XL";
    }
    if (device === "marlin") {
        return "Pixel XL";
    }
    if (device === "sailfish") {
        return "Pixel";
    }
    if (device === "taimen") {
        return "Pixel 2 XL";
    }
    if (device === "walleye") {
        return "Pixel 2";
    }
    return "Unknown";
}

for (const channel of channels) {
    for (const device of devices) {
        fetch(device + "-" + channel).then(response => {
            if (!response.ok) {
                return Promise.reject();
            }
            return response.text();
        }).then(text => {
            const metadata = text.trim().split(" ");
            const date = new Date(parseInt(metadata[1], 10) * 1000);
            const dateString = date.toISOString().replace("T", " ").replace("Z", "").split(".")[0];

            const baseUrl = "/";

            const factoryFilename = device + "-factory-" + metadata[0] + ".zip";
            const factoryUrl = baseUrl + factoryFilename;

            const updateFilename = device + "-ota_update-" + metadata[0] + ".zip";
            const updateUrl = baseUrl + updateFilename;

            const list = document.getElementById(channel);

            const model = deviceModel(device);

            const release = document.createElement("div");
            release.dataset.model = model;

            const header = document.createElement("h3");
            header.appendChild(document.createTextNode(model));
            release.appendChild(header);

            const version = document.createElement("p");
            version.appendChild(document.createTextNode("Version: " + metadata[2] + "." + metadata[0]));
            release.appendChild(version);

            release.appendChild(createLink(factoryUrl, factoryFilename));
            release.appendChild(document.createElement("br"));
            release.appendChild(createLink(factoryUrl + ".sig", factoryFilename + ".sig"));
            release.appendChild(document.createElement("br"));
            release.appendChild(createLink(updateUrl, updateFilename));

            for (const item of list.children) {
                if (model < item.dataset.model) {
                    list.insertBefore(release, item);
                    return;
                }
            }

            list.appendChild(release);
        });
    }
}
