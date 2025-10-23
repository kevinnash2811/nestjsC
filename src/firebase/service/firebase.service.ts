import { ConfigService } from '@nestjs/config';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private database: Database;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const app = initializeApp(this.getFirebaseConfig());

    this.database = getDatabase(app);
  }

  getInstance() {
    return this.database;
  }

  private getFirebaseConfig(): FirebaseOptions {
    return {
      apiKey: this.configService.get('FIREBASE_APIKEY'),
      authDomain: this.configService.get('FIREBASE_AUTHDOMAIN'),
      databaseURL: this.configService.get('FIREBASE_DATABASEURL'),
      projectId: this.configService.get('FIREBASE_PROJECTID'),
      storageBucket: this.configService.get('FIREBASE_STORAGEBUCKET'),
      messagingSenderId: this.configService.get('FIREBASE_MESSAGEINGSENDERID'),
      appId: this.configService.get('FIREBASE_APPID'),
      measurementId: this.configService.get('FIREBASE_MEASUREMENTID'),
    };
  }
}
