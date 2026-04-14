import data from "../data.json";

type ExtensionObj = {
  logo: string;
  name: string;
  description: string;
  isActive: boolean;
};

type InputObj = {
  inputEl: HTMLInputElement;
  filterCallback?(obj: ExtensionObj): boolean;
};

const extensionsData: ExtensionObj[] = data;

const bodyEl = document.getElementsByTagName("body")[0] as HTMLElement;
const gridContainer = document.querySelector(".grid-container") as HTMLElement;
const inputAllEl = document.getElementById("all") as HTMLInputElement;
const inputActiveEl = document.getElementById("active") as HTMLInputElement;
const inputInactiveEl = document.getElementById("inactive") as HTMLInputElement;
const buttonSwitchTheme = document.querySelector(
  ".btn-switch-theme",
) as HTMLButtonElement;
const filterOptions: Array<InputObj> = [
  {
    inputEl: inputAllEl,
  },
  {
    inputEl: inputActiveEl,
    filterCallback: (obj) => obj.isActive,
  },
  {
    inputEl: inputInactiveEl,
    filterCallback: (obj) => !obj.isActive,
  },
];

const createExtensionTemplate = (extensionData: ExtensionObj): HTMLElement => {
  const container = document.createElement("div");
  const header = document.createElement("header");
  const logo = document.createElement("img");
  const extensionInfo = document.createElement("div");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const footer = document.createElement("footer");
  const btnRemove = document.createElement("button");
  const btnSwitch = document.createElement("button");
  const switchHiddenText = document.createElement("span");

  container.className = "extension";
  header.className = "flex-container flex-start-y";

  logo.src = extensionData.logo;
  logo.alt = extensionData.name + " logo";

  title.textContent = extensionData.name;
  description.textContent = extensionData.description;

  extensionInfo.className = "extension-info";
  extensionInfo.append(title, description);

  header.append(logo, extensionInfo);

  btnRemove.className = "btn btn-remove";
  btnRemove.textContent = "Remove";
  btnRemove.addEventListener("click", (evt) => {
    const element = evt.target;
    if (element && element instanceof Element) {
      const containerElement = element.closest(".extension");
      if (containerElement) {
        extensionsData.splice(extensionsData.indexOf(extensionData), 1);
        containerElement.remove();
      }
    }
  });

  btnSwitch.className = extensionData.isActive
    ? "btn btn-switch is-active"
    : "btn btn-switch";
  btnSwitch.addEventListener("click", () => {
    const isActive = btnSwitch.classList.toggle("is-active");
    extensionData.isActive = isActive;
  });

  switchHiddenText.textContent = "Switch";
  switchHiddenText.className = "visually-hidden";

  btnSwitch.append(switchHiddenText);

  footer.append(btnRemove, btnSwitch);

  container.append(header, footer);

  return container;
};

const generateExtensionsTemplate = (
  callback?: (obj: ExtensionObj) => boolean,
): void => {
  if (gridContainer) {
    let extensionDataInner = extensionsData;

    gridContainer.textContent = "";

    if (callback) {
      extensionDataInner = extensionsData.filter(callback);
    }

    extensionDataInner.forEach((obj) => {
      const extenstionTemplate = createExtensionTemplate(obj);
      gridContainer.append(extenstionTemplate);
    });
  }
};

const setListeners = (): void => {
  if (buttonSwitchTheme) {
    buttonSwitchTheme.addEventListener("click", () => {
      bodyEl.classList.toggle("theme-dark");
      bodyEl.classList.toggle("animate");
    });
  }

  filterOptions.forEach((option) => {
    if (option.inputEl) {
      option.inputEl.addEventListener("click", () => {
        if (option.inputEl.checked) {
          if (option.filterCallback) {
            generateExtensionsTemplate(option.filterCallback);
          } else {
            generateExtensionsTemplate();
          }
        }
      });
    }
  });
};

const init = (): void => {
  if (inputAllEl) {
    inputAllEl.checked = true;
    generateExtensionsTemplate();
  }
};

setListeners();
init();
