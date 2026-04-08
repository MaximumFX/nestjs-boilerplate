import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';
import { FilesModule } from '../files/files.module';
import { RolesGuard } from '../roles/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;
// </database-block>

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ApiKeyGuard, JwtAuthGuard, RolesGuard],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
