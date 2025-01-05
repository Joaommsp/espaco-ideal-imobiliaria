import { Module } from '@nestjs/common';
import { PropriedadeService } from './propriedade.service';
import { PropriedadeController } from './propriedade.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PropriedadeController],
  providers: [PropriedadeService],
})
export class PropriedadeModule {}
