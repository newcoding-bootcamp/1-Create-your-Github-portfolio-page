function addText(element, text) {
  element.appendChild(document.createTextNode(text));
  return element;
}

function makeEl(tag, classes, parent) {
  let el = document.createElement(tag);

  if (classes !== undefined) {
    el.classList = classes;
  }

  if (parent !== undefined) {
    parent.appendChild(el);
  }

  return el;
}

function makeDL(items, classes, parent) {
  let dl = makeEl('dl', classes, parent);

  for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
    let item = items[itemIndex];
    addText(makeEl('dt', undefined, dl), item[0]);
    addText(makeEl('dd', undefined, dl), item[1]);
  }

  return dl;
}

function generateLaunch(data) {
  let launch = makeEl('div', 'launch');
  let topLayout = makeEl('div', 'top-layout', launch);
  let patchContainer = makeEl('div', 'patch-container', topLayout);
  let missionPatch = makeEl('img', 'mission-patch', patchContainer);
  missionPatch.src = data.links.mission_patch_small;

  let statsContainer = makeEl('div', 'stats-container', topLayout);
  let missionStatus = makeEl('div', 'mission-status', statsContainer);
  if (data.launch_success) {
    missionStatus.classList.add('success');
    addText(missionStatus, 'Success');
  } else {
    missionStatus.classList.add('fail');
    addText(missionStatus, 'Failure');
  }

  let statData = [
    ['Flight Number', data.flight_number],
    ['Rocket', data.rocket.rocket_name],
    ['Launch Site', data.launch_site.site_name],
    ['Launch Date', data.launch_date_utc],
  ];
  makeDL(statData, 'mission-stats', statsContainer);

  if (data.details) {
    let bottomLayout = makeEl('div', 'bottom-layout', launch);
    let tab = addText(makeEl('div', 'tab', bottomLayout), 'Details');
    let details = addText(makeEl('div', 'details', bottomLayout), data.details);
  }

  return launch;
}

function callAPI() {
  let url = 'https://api.spacexdata.com/v2/launches';

  return fetch(url).then(
    function(response) {
      return response.json();
    },
    function(err) {
      console.error(err);
      return [];
    }
  );
}

function loadLaunches() {
  callAPI().then(function(allLaunches) {
    allLaunches.reverse();
    let launches = makeEl('div', 'launches');

    for (var launchIndex = 0; launchIndex < allLaunches.length; launchIndex++) {
      let launch = generateLaunch(allLaunches[launchIndex]);
      launches.appendChild(launch);
    }

    let body = document.querySelector('body');
    body.appendChild(launches);
  });
}

document.addEventListener('DOMContentLoaded', loadLaunches);
