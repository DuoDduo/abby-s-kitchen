var app = angular.module("restaurant", ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/register', {
        templateUrl: 'register.html',
        controller: 'RegisterCtrl'
    }).
    when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
    }).
    when('/main', {
        templateUrl: 'main.html',
        controller: 'MainCtrl'
    }).
    when('/about', {
        templateUrl: 'about.html',
        controller: 'AboutCtrl'
    }).
    when('/menu', {
        templateUrl: 'menu.html',
        controller: 'MenuCtrl'
    }).
    when('/gallery', {
        templateUrl: 'gallery.html',
        controller: 'GalleryCtrl'
    }).
    when('/contact', {
        templateUrl: 'contact.html',
        controller: 'ContactCtrl'
    }).
    when('/foods', {
        templateUrl: 'product.html',
        controller: 'FoodsCtrl'
    }).
    when('/faqs', {
        templateUrl: 'faqs.html',
        controller: 'FAQsCtrl'
    }).
   
    otherwise({
        redirectTo: '/register' // Set the default route to 'register'
    });
}])



app.controller('RegisterCtrl', function ($scope, $window, $location) {
    $scope.user = {
        email: '',
        password: '',
        confirmPassword: ''
    };

    $scope.errorMessage = {
        passwordMismatch: false,
        missingFields: false
    };

    $scope.checkPasswordMatch = function () {
        $scope.errorMessage.passwordMismatch =
            $scope.user.password !== $scope.user.confirmPassword;
    };

    $scope.submitForm = function () {
        // Check if the form is valid
        if ($scope.registerForm.$valid) {
            if ($scope.errorMessage.passwordMismatch) {
                // Passwords don't match, show an alert
                alert('Passwords do not match.');
                return;
            }

            // Store user data in session storage
            var userData = {
                email: $scope.user.email,
                password: $scope.user.password
                // You can add more user-related data here
            };

            // Log user details to the console
            console.log('User Details Registered:', userData);

            // Store user data in session storage
            $window.sessionStorage.setItem('userData', JSON.stringify(userData));

            // Redirect to the login page
            $location.path('/login');
        } else {
            // Mark the missing fields
            $scope.errorMessage.missingFields = true;
        }
    }

    // Function to navigate to the login page
    $scope.navigateToLogin = function () {
        $location.path('/login'); // Navigate to the login page
    }

    var storedUserData = $window.sessionStorage.getItem('userData');
    if (storedUserData) {
        var userData = JSON.parse(storedUserData);
        console.log('Stored User Data:', userData);
        // Use the userData object as needed
    } else {
        console.log('User data not found in session storage');
    }
})


app.controller('LoginCtrl', function ($scope, $window, $location) {
    $scope.user = {
        email: '',
        password: ''
    };

    $scope.errorMessage = {
        loginFailed: false
    };

    $scope.login = function () {
        // Retrieve user data from session storage
        var storedUserData = $window.sessionStorage.getItem('userData');
        if (storedUserData) {
            var userData = JSON.parse(storedUserData);

            // Check if the entered email matches stored user data
            if ($scope.user.email === userData.email) {
                // Check if the entered password matches stored user data
                if ($scope.user.password === userData.password) {
                    // Successful login
                    // You can perform additional actions here if needed
                    alert("Login successful");

                    // Hide the login and registration buttons
                    var loginButton = document.getElementById("login-button");
                    var registerButton = document.getElementById("register-button");
                    var logoutButton = document.getElementById("logout-button");
                    loginButton.style.display = "none";
                    registerButton.style.display = "none";
                    logoutButton.style.display = "block";

                    // Redirect to the main page
                    $location.path('/main');
                } else {
                    // Incorrect password, show an error message
                    $scope.errorMessage.loginFailed = true;
                }
            } else {
                // Email not found, show an error message
                $scope.errorMessage.loginFailed = true;
            }
        } else {
            // User data not found, show an error message
            $scope.errorMessage.loginFailed = true;
        }
    }
})



app.controller('MainCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
    // Function to check if the user is logged in
    $scope.isUserLoggedIn = function () {
        var storedUserData = $window.sessionStorage.getItem('userData');
        return !!storedUserData; // Returns true if user data is found, indicating the user is logged in
    };

    // Function to log out the user
    $scope.logout = function () {
        // Remove user data from session storage
        $window.sessionStorage.removeItem('userData');
        // Redirect to the login page or any other desired page
        $location.path('/login');
    };

    // Additional functionality can be added here
    $scope.someOtherFunction = function () {
        // Implement additional functionality here
    };

    // ... You can continue adding more functions or logic as needed

    // Call the updateButtonVisibility function initially to set the initial visibility
    $scope.updateButtonVisibility();
}])






.controller('MenuCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('menu.json').then(function(response) {
        $scope.menus = response.data;
    });
}])

.controller('GalleryCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('gallery.json').then(function(response) {
        $scope.gallerys = response.data;
    });
    $scope.searchText = ''; // Initialize searchText

    // You can add more functions or variables here if needed

    // Example: Function to clear the search input
    $scope.clearSearch = function () {
        $scope.searchText = '';
    };
}])

.controller('ContactCtrl', ['$scope', function($scope) {
    // Controller logic for the "Contact" page goes here
}])
.controller('MainCtrl', ['$scope', function($scope) {
    // Controller logic for the "Contact" page goes here
}])

.controller('FoodsCtrl', ['$scope', function($scope) {
    // Controller logic for the "Foods" page goes here
}])

.controller('AboutCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.getClass = function(path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };
}])

.controller('FAQsCtrl', ['$scope', function($scope) {
    // Controller logic for the "FAQs" page goes here
}])

// Add more controllers for other pages as needed

document.getElementById("year").innerHTML = new Date().getFullYear();
var currentDomain = window.location.hostname;
        console.log('Domain: ' + currentDomain);

// Get the "Sign Up" button and email input element
const signUpButton = document.querySelector(".footer-subscribe button");
const emailInput = document.querySelector(".footer-subscribe input[type='email']");

// Regular expression for email validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Add a click event listener to the "Sign Up" button
signUpButton.addEventListener("click", function () {
    const userEmail = emailInput.value;

    // Check if the email input matches the email validation regex
    if (emailRegex.test(userEmail)) {
        // Display a subscription successful alert
        alert("Subscription successful! Thank you for signing up with " + userEmail + " to our news letter");
        
        emailInput.value = "";
    } else {
        // Display an alert if the email input is empty or invalid
        alert("Please enter a valid email address to sign up.");
    }
});

