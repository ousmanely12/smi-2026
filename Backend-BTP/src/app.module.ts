import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// ─── Modules métier BATIPME-SN ───────────────────────────────────────────────
import { ProjetsModule } from './projets/projets.module';           // M1
import { PlanningModule } from './planning/planning.module';         // M2
import { BudgetModule } from './budget/budget.module';               // M3
import { RessourcesModule } from './ressources/ressources.module';   // M4
import { SuiviChantierModule } from './suivi-chantier/suivi-chantier.module'; // M5
import { DocumentsModule } from './documents/documents.module';       // M6
import { ApprovisionnementsModule } from './approvisionnement/approvisionnements.module'; // M7
import { FacturationModule } from './facturation/facturation.module'; // M8
import { DashboardModule } from './dashboard/dashboard.module';       // M9
import { AuthModule } from './auth/auth.module';                     // M10
import { UtilisateursModule } from './utilisateurs/utilisateurs.module'; // M10

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', ''),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', ''),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ⚠️ À remplacer par des migrations en production
      }),
    }),
    ProjetsModule,
    PlanningModule,
    BudgetModule,
    RessourcesModule,
    SuiviChantierModule,
    DocumentsModule,
    ApprovisionnementsModule,
    FacturationModule,
    DashboardModule,
    AuthModule,
    UtilisateursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}