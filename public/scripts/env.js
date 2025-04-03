(function (window) {
    window.env = window.env || {};

    window['env']['VITE_API_URL'] = 'value';
    console.log(window['env']['VITE_API_URL'])
})(this);