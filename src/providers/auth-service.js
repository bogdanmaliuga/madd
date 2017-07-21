var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import firebase from 'firebase';
var AuthService = (function () {
    function AuthService() {
        this.fireAuth = firebase.auth();
        this.userData = firebase.database().ref('/userData');
    }
    //login()
    AuthService.prototype.doLogin = function (email, password) {
        return this.fireAuth.signInWithEmailAndPassword(email, password).then(function (res) {
            console.log(res);
        });
    };
    //register()
    AuthService.prototype.register = function (email, password, name,cpf,birthdate) {
        var _this = this;
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then(function (newUser) {
            console.log(newUser);
            _this.userData.child(newUser.uid).set({email: email,name:name,cpf:cpf,birthdate:birthdate });
            // this.userData.child(newUser.uid).set({type:type});
        });
    };
    //resetpassword
    AuthService.prototype.resetPassword = function (email) {
        return this.fireAuth.sendPasswordResetEmail(email);
    };
    //logout
    AuthService.prototype.doLogout = function () {
        return this.fireAuth.signOut();
    };
    return AuthService;
}());
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth-service.js.map