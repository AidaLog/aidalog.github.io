$(document).ready(() => {

    $(".inputs").on("change", () => {
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
    });


    

});