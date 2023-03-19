let map, draw, source, layer, coordinates;

const tableBody = document.getElementById('tableData').getElementsByTagName('tbody')[0];
const btnOpenModal = document.getElementById('btnOpenModal');

var savedCoordinatesModal = new bootstrap.Modal(document.getElementById('savedCoordinatesModal'), {
    keyboard: false
});

var searchCoordinatesModal = new bootstrap.Modal(document.getElementById('searchCoordinatesModal'), {
    keyboard: false
});

initializeMap = () => {

    source = new ol.source.Vector({ wrapX: false });

    layer = new ol.layer.Vector({
        source: source,
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            layer
        ],
        view: new ol.View({
            center: [3875337.272593909, 4673762.797695817],
            zoom: 7
        })
    });
}

addInteraction = () => {

    draw = new ol.interaction.Draw({
        source: source,
        type: "LineString"
    });

    map.addInteraction(draw);

    draw.setActive(false);

    draw.on("drawend",
        (event) => {

            console.log(event.feature.getGeometry().getCoordinates());

            coordinates = event.feature.getGeometry().getCoordinates();

            savedCoordinatesModal.show();

            draw.setActive(false);
        });
}

addDrawing = () => {

    draw.setActive(true);
}

document.addEventListener("DOMContentLoaded", () => {

    initializeMap();

    addInteraction();
});

function submitForm() {
    var name = document.getElementById("name").value;
    var number = document.getElementById("number").value

    var body = JSON.stringify({ name: name, number: number, coordinates: coordinates });
    console.log(body);

    fetch('/map/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(data => console.log(data))
        .catch(error => console.error(error))
        .finally(() => savedCoordinatesModal.hide());

}

btnOpenModal.addEventListener('click', function () {
    fetch('/Map/Query')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = "";
            data.forEach(item => {
                const row = tableBody.insertRow();
                const nameCell = row.insertCell(0);
                const numberCell = row.insertCell(1);
                const coordinatesCell = row.insertCell(2);

                nameCell.innerHTML = item.name;
                numberCell.innerHTML = item.number;
                coordinatesCell.innerHTML = JSON.stringify(item.coordinates);

                row.setAttribute("data-coordinates", JSON.stringify(item.coordinates));

                row.addEventListener("click", handleRowClick);

            });

            searchCoordinatesModal.show();
        })
        .catch(error => console.error(error));
});

function handleRowClick(event) {
    const coordinates = JSON.parse(event.currentTarget.getAttribute("data-coordinates"));
    drawCoordinates(coordinates);
    searchCoordinatesModal.hide();
}

function drawCoordinates(coordinates) {
    var vectorSource = new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Polygon([coordinates]),
            }),
        ],
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new ol.style.Stroke({
                color: "#ffcc33",
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: "#ffcc33",
                }),
            }),
        }),
    });

    map.addLayer(vectorLayer);

    var extent = vectorSource.getExtent();
    map.getView().fit(extent, { padding: [50, 50, 50, 50] });
}