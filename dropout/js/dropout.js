let xhttp = new XMLHttpRequest();
const URL = "https://oyster-app-c8hnb.ondigitalocean.app/";


$(document).ready(() => {

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

    $(".inputs").on("change", ()=>{
        sendPostRequest(getFormValues()).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.data.result);
            }
        }, (error) => {
            console.log(error);
            console.log("Error: " + error.status + " " + error.data);
        });
    });
});



function sendPostRequest(formValues) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // The request has been processed successfully
                    resolve({status: this.status, data: JSON.parse(this.responseText)});
                } else {
                    // There was an error with the request
                    reject({status: this.status, data: this.responseText});
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
