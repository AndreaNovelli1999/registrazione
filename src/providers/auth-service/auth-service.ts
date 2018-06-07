import { Injectable } from '@angular/core';
//utilizzo md5 per eseguire hash della password
import * as md5 from "md5";
import {Observable} from 'rxjs/Observable';
//utilizzo classe storage per salvare e controllare la password dal login
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  constructor(private storage: Storage){}
  currentUser: User;



  public login(credentials) { //controllo email e password per accesso
    if (credentials.email === null || credentials.password === null) { //nel caso in cui non siano ancora state  inserite le credenziali verrà mostrato il messaggio seguente
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

        this.storage.get(credentials.email).then(password => {

          if(md5(password) == md5(credentials.password)){ //confronto l'hash delle due password
            observer.next(true);
            observer.complete();

        } else{
            observer.next(false);
            observer.complete();
        }
          });

      });
    }
  }

  public register(credentials) { //registrazione per nuovo utente utilizzando md5 per l'hash
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {

      return Observable.create(observer => {
        this.storage.set(credentials.email, md5(credentials.password)); //criptazione della password tramite md5
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() { //logout dell'utente impostando l'user come null
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
