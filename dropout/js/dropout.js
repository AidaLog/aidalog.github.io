const URL = "https://oyster-app-c8hnb.ondigitalocean.app/";
var default_model = "KNeighborsClassifier";
var models = null;

$(document).ready(() => {

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    loadDefaultModel();

    function getFormValues() {
        let formValues = {};

        document.querySelectorAll('form').forEach((form) => {
            form.querySelectorAll('input, select').forEach((input) => {
                if (input.type === "radio") {
                    if (input.checked) {
                        formValues[input.name] = input.value;
                    }
                } else {
                    formValues[input.name] = input.value;
                }
            });
        });

        console.log(formValues);
        $("#age_value").html(formValues.age + " years");
        return formValues;
    }

    $(".inputs").on("change", () => {
        sendPostRequest(getFormValues()).then((response) => {
            console.log(response);
            if (response.status === 200) {
                display_loading_status_message("🎉");
                hide_loader();

                render_results(response.data);
                // updateChart(getProbabilitiesForModel(response.data, default_model));
            }
        }, (error) => {
            display_loading_status_message("⚠ There is an error. Please try again.");
            console.log(error);
            console.log("Error: " + error.status + " " + error.data);
        });


        $("#timestamp").val(get_current_time());
    });

    $(".candidate_model").on("click", () => {
        // get html of the clicked element
        var model = $(event.target).html();
        setDefaultModel(model);
    });


    const form_ = document.getElementById('form-id');
    const submit_button = document.getElementById('save-data');
    submit_button.addEventListener("click", function(e) {
        e.preventDefault();
        const data = new FormData(form_);
        const action = e.target.action;
        display_loader();
        display_loading_status_message("Saving data...")
        fetch(action, {
            method: 'POST',
            body: data,
        }).then(() => {
            hide_loader();
            // display_loading_status_message("Data saved successfully");
            // clear form
            form_.reset();
        })
    });
});


function sendPostRequest(formValues) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        // display_loader
        display_loader();

        // show message
        display_loading_status_message("🏃‍♂️");

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // The request has been processed successfully
                    resolve({ status: this.status, data: JSON.parse(this.responseText) });
                } else {
                    // There was an error with the request
                    reject({ status: this.status, data: this.responseText });
                }
            }
        };

        xhttp.open("POST", URL, true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        // Convert the formValues object to a JSON string
        let data = JSON.stringify(formValues);

        xhttp.send(data);
    });
}


function hide_loader() {
    $("#loader").css("display", "none");
    $("#results-display").css("display", "block");
}

function display_loader() {
    $("#loader").css("display", "block");
    $("#results-display").css("display", "none");
}

function display_loading_status_message(message) {
    $("#loading_status").html(message);
}

function display_prediction_result(dropout_message) {
    $("#dropout-message").html(dropout_message);
}

function createChart() {
    const ctx = document.getElementById('myChart');

    const data = {
        labels: [
            'Not Dropout',
            'Dropout',
        ],
        datasets: [{
            label: 'Predictions',
            data: [.5, .5],
            backgroundColor: [
                '#60ef7d',
                '#EB4D55',
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
    };

    var myChart = new Chart(ctx, config);

    return myChart;
}

var myChart = createChart();

function updateChart(newData) {
    myChart.data.datasets[0].data = newData;
    myChart.update();
}

function update_bar_color(status) {
    if (status == 'No') {
        //  replace class name bg-secondary or bg-danger wirh bg-success
        $("#bar").removeClass("bg-danger").addClass("bg-success") || $("#bar").removeClass("bg-secondary").addClass("bg-success");
    } else {
        $("#bar").removeClass("bg-success").addClass("bg-danger") || $("#bar").removeClass("bg-secondary").addClass("bg-danger");
    }
}

function generateResultMessage(status) {
    if (status == "No") {
        return "Student is not likely to dropout";
    } else {
        return "Student is likely to dropout";
    }
}

// Function to calculate average probabilities
function calculateAverageProbabilities(data) {
    let probabilities = [];
    for (let model in data.predictions) {
        probabilities = probabilities.concat(data.predictions[model].predicted_probabilities);
    }
    const average = probabilities.reduce((acc, val) => acc + val, 0) / probabilities.length;
    return average;
}

function loadDefaultModel() {
    if (localStorage.getItem("default_model")) {
        default_model = localStorage.getItem("default_model");
    } else {
        localStorage.setItem("default_model", default_model);
    }
    $("#model").html(default_model);
}

// Function to set default model
function setDefaultModel(model) {
    default_model = model;
    localStorage.setItem("default_model", model);
    $("#model").html(default_model);
}


// Function to return probabilities for a given model name
function getProbabilitiesForModel(data, modelName) {
    return data.predictions[modelName].predicted_probabilities;
}

function render_results(data) {
    var predicted_class = data.predictions[default_model].predicted_class;
    var probabilities = data.predictions[default_model].predicted_probabilities;

    // fill the hidden probability class
    $("#probability-class").val(predicted_class);

    //  display predicted class
    display_prediction_result(predicted_class);

    //  update chart
    updateChart(probabilities);

    // update bar color
    update_bar_color(predicted_class);

    //  update result message
    display_prediction_result(generateResultMessage(predicted_class));

    //  update the probability value
    var max_probability = Math.max(...probabilities);
    max_probability = (max_probability * 100).toFixed(3);
    $("#probability_value").html(max_probability + " %");
}

function get_current_time() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}