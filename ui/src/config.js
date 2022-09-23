
const config = {
    development: {
        apiUrl: "http://localhost:8080"
    },

    production: {
        apiUrl: "https://invenmag-api.herokuapp.com" // change this
    },
    test: {
        apiUrl: ''
    }
}

export default config;